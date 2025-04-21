import datetime
from enum import Enum
import logging
from typing import Any, Dict, List, Optional

from app.services.auth.auth import Auth
from app.services.auth.oauth import Authorization
import requests
import yaml
from fastapi import Depends, FastAPI, HTTPException, status, APIRouter
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel


api_router = APIRouter()


@api_router.get("/health")
async def health():
    return {"status": "ok"}
