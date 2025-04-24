import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer

from app.api.tools import authorize
from app.api.v1.endpoints.providers import JWTSchema
from app.core.crypto_manager import CryptoManager
from app.core.dependencies import (
    get_crypto_manager,
    get_use_cases_factory,
    get_user_service,
)
from app.core.tokens import user_to_token_claims
from app.services.user import UserService
from app.use_cases.factory import UseCasesFactory

from ..schemas.account import RegisterAccountSchema, UpdateAccountSchema

api_router = APIRouter()


@api_router.post("/account/create")
async def create_account(
    temporary_bearer=Depends(HTTPBearer(description="Temporary bearer token")),
    use_cases: UseCasesFactory = Depends(get_use_cases_factory),
):
    try:
        crypto_manager = get_crypto_manager()
        jwt_token_claims = crypto_manager.verify_jwt_token(temporary_bearer.credentials)
        provider_user_id = jwt_token_claims["sub"]
        if not jwt_token_claims["iss"].startswith("social:"):
            raise Exception("Invalid token (iss is not social)")
        provider_slug = jwt_token_claims["iss"].replace("social:", "")
        provider_data = json.loads(
            crypto_manager.decrypt_message(jwt_token_claims["epd"])
        )
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    user = await use_cases.create_user_from_provider(
        provider_slug=provider_slug,
        provider_user_id=provider_user_id,
        provider_data=provider_data,
    )
    data = user_to_token_claims(user)
    jwt_token = crypto_manager.create_signed_jwt(data)
    return JWTSchema(access_token=jwt_token)


@api_router.post("/account/register")
@authorize()
async def register_account(
    data: RegisterAccountSchema,
    request: Request,
    use_cases: UseCasesFactory = Depends(get_use_cases_factory),
):
    try:
        jwt_token_claims = request.state.jwt
        user_id = jwt_token_claims["sub"]
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    user = await use_cases.update_registr(
        user_id,
        email=data.email,
        first_name=data.first_name,
        last_name=data.last_name,
        second_name=data.second_name,
        region_id=data.region_id,
        role_request=data.role_request,
    )
    return {"status": "ok"}


@api_router.put("/account/update")
@authorize()
async def update_account(
    data: UpdateAccountSchema,
    request: Request,
    user_service: UserService = Depends(get_user_service),
):
    try:
        user = request.state.user
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    for key, value in data.model_dump().items():
        if value is not None:
            setattr(user, key, value)

    await user_service.update_user(user)

    return {"status": "ok"}


@api_router.get("/account/token")
@authorize()
async def update_token(
    request: Request,
    user_service: UserService = Depends(get_user_service),
):
    try:
        jwt = request.state.jwt
        user_id = jwt["sub"]
        user = await user_service.get_user_by_id(user_id)
        data = user_to_token_claims(user)
        crypto_manager = get_crypto_manager()
        jwt_token = crypto_manager.create_signed_jwt(data)
        return JWTSchema(access_token=jwt_token)
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update token",
        )


@api_router.post("/accounts/get")
async def accounts(
    request: Request,
    ids: list[str],
    user_service: UserService = Depends(get_user_service),
):
    try:
        # jwt = request.state.jwt
        # user_id = jwt["sub"]
        users = await user_service.get_users_by_ids(ids)

        return users
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed",
        )
