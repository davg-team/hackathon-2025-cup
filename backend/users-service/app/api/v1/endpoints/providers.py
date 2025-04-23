import json
import logging
import time
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer
from pydantic import BaseModel

from app.core.config import Auth
from app.core.crypto_manager import CryptoManager
from app.core.dependencies import (
    get_crypto_manager,
    get_relation_service,
    get_user_service,
)
from app.core.tokens import user_to_token_claims
from app.services import RelationService, UserService
from app.services.auth.oauth import BaseOAuthProvider

# from app.use_cases.factory import UseCasesFactory
# from app.core.dependencies import get_use_cases_factory


api_router = APIRouter()

auth = Auth()


httpbearer_scheme = HTTPBearer()


class OAuth2PKCESchema(BaseModel):
    required: bool = False
    method: Optional[str] = "S256"


class OAuth2AuthorizeParamsSchema(BaseModel):
    client_id: str
    response_type: str = "code"
    scope: str = ""
    # state: str = None


class OAuth2AuthorizeShema(BaseModel):
    url: str
    params: OAuth2AuthorizeParamsSchema
    pkce: OAuth2PKCESchema = None


class OAuth2Schema(BaseModel):
    authorize: OAuth2AuthorizeShema
    instant_authorization: bool = False


class ProviderTypeEnum(str, Enum):
    OAUTH2 = "oauth2"
    OTHER = "other"


class ProviderSchema(BaseModel):
    slug: str
    name: str = "Untitled"
    type: ProviderTypeEnum
    service: str
    description: str = ""
    icon: str = None
    oauth2: Optional[OAuth2Schema] = None
    other_data: Optional[Dict[str, Any]] = None

    # Делаем так чтобы при дампе модели, не показывались поля значения которых None
    # __pydantic_extra__ = {
    #     "forbid_extra": True,
    #     "allow_extra": False,
    # }


@api_router.get("/providers")
async def list_providers() -> List[ProviderSchema] | str:
    """Возвращает список доступных провайдеров"""
    providers_list = auth.list_providers()

    providers = []

    for provider in providers_list:
        if not provider.status.value == "active":
            print(provider.status)
            continue
        provider_schema = ProviderSchema(
            slug=provider.slug,
            type=ProviderTypeEnum(provider.type.value),
            service=provider.service,
            name=provider.info.name,
            description=provider.info.description,
            icon=provider.info.icon,
        )

        if provider.type.value == "oauth2":
            provider_schema.oauth2 = OAuth2Schema(
                authorize=OAuth2AuthorizeShema(
                    url=provider.get_authorization().url,
                    params=OAuth2AuthorizeParamsSchema(
                        client_id=provider.oauth_client.id,
                        response_type=provider.oauth_flow.authorize.response_type,
                        scope=" ".join(provider.oauth_other_settings.scopes),
                    ),
                    pkce=OAuth2PKCESchema(
                        required=provider.oauth_other_settings.pkce["required"],
                        method=provider.oauth_other_settings.pkce["method"],
                    ),
                ),
                instant_authorization=provider.oauth_other_settings.instant_authorization,
            )

        elif provider.type.value == "other":
            match provider.service:
                case "telegram":
                    provider_schema.other_data = {
                        "bot_username": provider.bot_username,
                        "request_access": provider.request_access,
                        "bot_id": provider.bot_id,
                    }
                    # print(provider.__dict__)
                case _:
                    print(provider.__dict__)

        providers.append(provider_schema)

    return providers


class JWTSchema(BaseModel):
    access_token: str
    token_type: str = "Bearer"


class OauthByCodeSchema(BaseModel):
    code: str
    state: Optional[str] = None
    deviceid: Optional[str] = None
    redirect_uri: Optional[str] = None


@api_router.post("/providers/{provider_slug}/authorize/oauth_code")
async def authorize_code(
    provider_slug: str,
    data: OauthByCodeSchema,
    crypto_manager: CryptoManager = Depends(get_crypto_manager),
    relation_service: RelationService = Depends(get_relation_service),
    user_service: UserService = Depends(get_user_service),
) -> JWTSchema:
    """Авторизация по коду OAuth2 провайдера и получение JWT токена"""

    # Roadmap:
    # 1. Получить провайдера из auth
    # 2. Проверить что провайдер существует
    # 3. Проверить что провайдер - OAuth2
    # 4. Обменять код на токен у провайдера + обработать ошибки
    # 5. Получить информацию об id пользователя
    # 5.1. Получить id пользователя из токена + обработать ошибки
    # ЛИБО
    # 5.2. Запросить информацию о пользователе у провайдера и получить id + обработать ошибки
    # 6. Попытаться получить данные о связи провайдера с пользователем из БД + обработать ошибки
    # 7. Если связи нет, то выдать временный токен (зашифровав токен провайдера)
    # 8. Если связь есть, то выдать токен с данными пользователя

    # Получаем провайдера
    provider: BaseOAuthProvider = auth[provider_slug]

    print(provider)

    # Проверяем что провайдер существует
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found"
        )

    # Проверяем что провайдер - OAuth2
    if provider.type.value != "oauth2":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider is not OAuth2",
        )

    # Обменяем код на токен у провайдера
    try:
        provider_token_data = provider.exchange_code_for_token(
            code=data.code,
            redirect_uri=data.redirect_uri,
            state=data.state,
            # deviceid=data.deviceid,
        )

    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code\n\n" + str(e),
        )

    # Получаем id пользователя
    try:
        user_id = str(provider.get_user_id(provider_token_data))
        try:
            user_info = provider.get_user_info_request(provider_token_data)
        except Exception as e:
            user_info = {}
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user id"
        )

    # Получаем данные о связи провайдера с пользователем из БД
    try:
        relation = await relation_service.get_relation_by_provider_user_id(
            provider_slug=provider_slug, user_id=user_id
        )
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed")

    # Если связи нет, то выдаем временный токен
    if not relation:
        provider_data = {
            "access_token": provider_token_data.access_token,
            "expires_in": provider_token_data.expires_in,
            "token_type": provider_token_data.token_type,
            "refresh_token": provider_token_data.refresh_token,
            "user_info": user_info,
        }

        encoded_provider_data = crypto_manager.encrypt_message(json.dumps(provider_data))
        data = {
            "iss": f"social:{provider_slug}",
            "sub": user_id,
            "aud": "platform",
            "exp": time.time() + 60 * 60,
            "iat": time.time(),
            "epd": encoded_provider_data,
        }

        jwt_token = crypto_manager.create_signed_jwt(data)

        return JWTSchema(access_token=jwt_token)

    # Выдаем токен с данными пользователя
    user = await user_service.get_user_by_id(relation.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
        )

    data = user_to_token_claims(user)

    jwt_token = crypto_manager.create_signed_jwt(data)

    return JWTSchema(access_token=jwt_token)


class AuthTelegramSchema(BaseModel):
    tgAuthResult: str


@api_router.post("/providers/{provider_slug}/authorize/tgAuthResult")
async def authorize_tg_auth_result(
    provider_slug: str,
    data: AuthTelegramSchema,
    crypto_manager: CryptoManager = Depends(get_crypto_manager),
    relation_service: RelationService = Depends(get_relation_service),
    user_service: UserService = Depends(get_user_service),
) -> JWTSchema:
    """Авторизация по коду OAuth2 провайдера и получение JWT токена"""

    # Roadmap:
    # 1. Получить провайдера из auth
    # 2. Проверить что провайдер существует
    # 3. Проверить что провайдер сервис Telegram
    # 4. Дешифровать и провалидировать данные от Telegram
    # 5. Получить информацию об id пользователя
    # 6. Попытаться получить данные о связи провайдера с пользователем из БД + обработать ошибки
    # 7. Если связи нет, то выдать временный токен (зашифровав токен провайдера)
    # 8. Если связь есть, то выдать токен с данными пользователя

    # Получаем провайдера
    provider: BaseOAuthProvider = auth[provider_slug]

    print(provider)

    # Проверяем что провайдер существует
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found"
        )

    # Проверяем что провайдер - Telegram
    if provider.service != "telegram":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider is not Telegram",
        )

    # Дешифровываем данные от Telegram
    # try:
    if True:
        decoded_data = provider.verify_tg_auth_result(data.tgAuthResult)
        print(decoded_data)
    # except Exception as e:
    #     logging.error(e)
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Failed to decode data from Telegram",
    #     )

    # Получаем id пользователя
    try:
        user_id = str(provider.get_user_id(decoded_data))
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user id"
        )

    # Получаем данные о связи провайдера с пользователем из БД
    try:
        relation = await relation_service.get_relation_by_provider_user_id(
            provider_slug=provider_slug, user_id=user_id
        )
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed")

    # Если связи нет, то выдаем временный токен
    if not relation:
        provider_data = {
            "user_info": decoded_data,
        }

        encoded_provider_data = crypto_manager.encrypt_message(json.dumps(provider_data))
        data = {
            "iss": f"social:{provider_slug}",
            "sub": user_id,
            "aud": "platform",
            "exp": time.time() + 60 * 60,
            "iat": time.time(),
            "epd": encoded_provider_data,
        }

        jwt_token = crypto_manager.create_signed_jwt(data)

        return JWTSchema(access_token=jwt_token)

    # Выдаем токен с данными пользователя
    user = await user_service.get_user_by_id(relation.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
        )

    data = user_to_token_claims(user)

    jwt_token = crypto_manager.create_signed_jwt(data)

    return JWTSchema(access_token=jwt_token)


async def get_user_and_create_jwt(
    role: str,
    crypto_manager: CryptoManager,
    user_service: UserService,
) -> JWTSchema:
    """Получает пользователя по ID и создает JWT токен."""

    if role not in ["root", "fsp_region_head", "sportsman"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role"
        )

    user = await user_service.get_user_by_id(role)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
        )

    data = user_to_token_claims(user)
    jwt_token = crypto_manager.create_signed_jwt(data)
    return JWTSchema(access_token=jwt_token)


@api_router.get("/get_token/{role}", include_in_schema=False)
async def api_get_root(
    role: str,
    crypto_manager: CryptoManager = Depends(get_crypto_manager),
    user_service: UserService = Depends(get_user_service),
):
    """Возвращает JWT токен для пользователя."""
    return await get_user_and_create_jwt(role, crypto_manager, user_service)


@api_router.get("/get/{role}", include_in_schema=False)
async def api_as_root(
    role: str,
    crypto_manager: CryptoManager = Depends(get_crypto_manager),
    user_service: UserService = Depends(get_user_service),
):
    """Устанавливает куку token для пользователя с указанной ролью и выполняет редирект на главную страницу."""

    jwt_schema = await get_user_and_create_jwt(role, crypto_manager, user_service)
    response = RedirectResponse(url="/")
    response.set_cookie(
        key="token",
        value=jwt_schema.access_token,
        httponly=False,
        samesite="strict",
        max_age=60 * 60 * 12,
    )
    return response
