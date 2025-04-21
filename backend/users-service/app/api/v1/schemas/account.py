from enum import Enum
from typing import Optional

from pydantic import BaseModel


class Role(str, Enum):
    root = "root"
    fsp_staff = "fsp_staff"
    fsp_region_staff = "fsp_region_staff"
    fsp_region_head = "fsp_region_head"
    sportsman = "sportsman"
    user = "user"


class RoleRequest(Enum):
    fsp_staff = "fsp_staff"
    fsp_region_staff = "fsp_region_staff"
    fsp_region_head = "fsp_region_head"
    sportsman = "sportsman"


class RegisterAccountSchema(BaseModel):
    role_request: RoleRequest
    email: str
    first_name: str
    last_name: str
    second_name: Optional[str] = None
    region_id: str


class UpdateAccountSchema(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    second_name: Optional[str]
    snils: Optional[str]
    phone: Optional[str]
    tg_id: Optional[str]
    notification_ways: Optional[list]
