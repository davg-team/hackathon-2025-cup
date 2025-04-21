import json
import logging
import time

from app.core.config import Auth
from app.core.dependencies import get_crypto_manager, get_filters_service
from app.services import FiltersService
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

api_router = APIRouter()

bearer = HTTPBearer(description="Bearer token")
crypto_manager = get_crypto_manager()


@api_router.get("/user/filters")
async def get_user_filters(
    bearer=Depends(bearer),
    filters_service: FiltersService = Depends(get_filters_service),
) -> list[str]:
    """Get user filters"""
    try:
        user_id = crypto_manager.verify_jwt_token(bearer.credentials)["sub"]
        # user_id = "test"

    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    filters = await filters_service.get_by_user_id(user_id)
    print(filters)

    return filters


@api_router.post("/user/filters")
async def create_user_filter(
    filter_: str,
    bearer=Depends(bearer),
    filters_service: FiltersService = Depends(get_filters_service),
) -> str:
    """Create user filter"""
    try:
        user_id = crypto_manager.verify_jwt_token(bearer.credentials)["sub"]
        # user_id = "test"

    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    filter_id = await filters_service.insert(filter_, user_id)
    print(filter_id)

    return filter_id


@api_router.delete("/user/filters")
async def delete_user_filter(
    filter_: str,
    bearer=Depends(bearer),
    filters_service: FiltersService = Depends(get_filters_service),
) -> str:
    """Delete user filter"""
    try:
        user_id = crypto_manager.verify_jwt_token(bearer.credentials)["sub"]
        # user_id = "test"

    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    filter_id = await filters_service.delete(filter_, user_id)
    print(filter_id)

    return filter_id
