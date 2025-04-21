import json
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

from app.core.dependencies import (
    get_crypto_manager,
    get_services_factory,
    get_use_cases_factory,
)
from app.use_cases.factory import UseCasesFactory

bearer = HTTPBearer(description="Bearer token")
crypto_manager = get_crypto_manager()
api_router = APIRouter()


@api_router.get("/requests/role/me", response_model=List[dict])
async def get_user_role_requests(
    bearer=Depends(bearer),
    service_factory=Depends(get_services_factory),
) -> List[dict]:
    """Получение реквестов ролей, относящихся к текущему пользователю"""
    try:
        token = crypto_manager.verify_jwt_token(bearer.credentials)
        user_id = token["sub"]
        fsp_id = token.get("region_id")
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный токен"
        )

    request_service = service_factory.get_request_service()

    requests = await request_service.get_requests_by_requested(user_id, fsp_id=fsp_id)
    return [
        {
            "id": request.request_id,
            "requester_id": request.requester_id,
            "requester_type": request.requester_type,
            "requested_id": request.requested_id,
            "requested_type": request.requested_type,
            "status": request.status,
            "subject": request.subject,
            "comment": request.comment,
            "created_at": request.created_at,
            "type": request.type,
        }
        for request in requests
    ]


@api_router.get("/requests/role/sent", response_model=List[dict])
async def get_sent_role_requests(
    bearer=Depends(bearer),
    service_factory=Depends(get_services_factory),
) -> List[dict]:
    """Получение реквестов ролей, отправленных текущим пользователем"""
    try:
        token = crypto_manager.verify_jwt_token(bearer.credentials)
        user_id = token["sub"]
        role = token["role"]
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный токен"
        )

    request_service = service_factory.get_request_service()

    requests = await request_service.get_requests_by_requester(user_id, role=role)
    return [
        {
            "id": request.request_id,
            "requester_id": request.requester_id,
            "requester_type": request.requester_type,
            "requested_id": request.requested_id,
            "requested_type": request.requested_type,
            "status": request.status,
            "subject": request.subject,
            "comment": request.comment,
            "created_at": request.created_at,
            "type": request.type,
        }
        for request in requests
    ]


@api_router.post("/requests/role/{request_id}/respond", response_model=dict)
async def respond_to_role_request(
    request_id: str,
    action: str,
    bearer=Depends(bearer),
    use_cases: UseCasesFactory = Depends(get_use_cases_factory),
    service_factory=Depends(get_services_factory),
) -> dict:
    """Акцепт или реджект реквеста (action = accept/reject)"""
    try:
        token = crypto_manager.verify_jwt_token(bearer.credentials)
        user_id = token["sub"]
        roles = token["roles"]
        fsp_id = token.get("region_id")

        print("respond")
        print("action", action)
        print("request_id", request_id)
        print("user_id", user_id)
        print("roles", roles)
        print("fsp_id", fsp_id)

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось обработать реквест",
        )

    if action.lower() not in ["accept", "reject"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверное действие"
        )

    # Проверяем права доступа
    if not any([r in ["root", "fsp_staff", "fsp_region_head"] for r in roles]):
        # if any([r.value in ["root", "fsp_staff", "fsp_region_head"] for r in roles]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав для изменения этого запроса",
        )

    await use_cases.role_request_response(action, request_id)

    return {"status": "ok"}


@api_router.delete("/requests/role/{request_id}", response_model=dict)
async def cancel_role_request(
    request_id: str,
    bearer=Depends(bearer),
    service_factory=Depends(get_services_factory),
) -> dict:
    """Отмена реквеста"""
    try:
        request_service = service_factory.get_request_service()
        user_id = crypto_manager.verify_jwt_token(bearer.credentials)["sub"]
        canceled_request = await request_service.cancel_request(request_id, user_id)
        return canceled_request.dict()
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Не удалось отменить реквест"
        )
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Не удалось отменить реквест"
        )

        #
        #
        #
        #
