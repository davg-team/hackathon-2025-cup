from pathlib import Path
from fastapi import FastAPI
import datetime
from enum import Enum
import logging
import random
from typing import Any, Dict, List, Optional

from app.services.auth.auth import Auth
from app.services.auth.oauth import Authorization
import yaml
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from jwcrypto import jwk
from jwcrypto.common import json_encode

from app.core.crypto_manager import CryptoManager
from app.core.dependencies import get_crypto_manager


api_router = APIRouter()


# API-метод для получения JWKS
@api_router.get("/.well-known/jwks.json")
async def get_jwks(crypto_manager: CryptoManager = Depends(get_crypto_manager)):
    jwks = crypto_manager.export_public_jwks()

    return jwks
