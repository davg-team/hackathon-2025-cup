from datetime import datetime
from enum import Enum
from typing import Any, Dict

import uuid6

from .base import Base

# Обновляю модель пользователя:

# id: str
# first_name: str
# last_name: str
# second_name: str
# email: str
# phone: str
# avatar: str
# region_id: str
# tg_id: str
# snils: str
# roles: List[str]
# status: str
# required: List[str]
# notification_ways: List[str]
# created_at: datetime
# last_login_at: datetime
# other_data: Dict[str, Any]


class Role(str, Enum):
    root = "root"
    fsp_staff = "fsp_staff"
    fsp_region_staff = "fsp_region_staff"
    fsp_region_head = "fsp_region_head"
    sportsman = "sportsman"
    user = "user"


class Status(str, Enum):
    active = "active"
    inactive = "inactive"
    blocked = "blocked"
    validation = "validation"


class User(Base):
    id: str = None
    first_name: str = None
    last_name: str = None
    second_name: str = None
    email: str = None
    phone: str = None
    avatar: str = None
    region_id: str = None
    tg_id: str = None
    snils: str = None
    roles: list[Role] = []
    status: Status = None
    required: list[str] = []
    notification_ways: list[str] = []
    created_at: datetime = None
    last_login_at: datetime = None
    other_data: dict[str, Any] = {}

    @classmethod
    def generate_user_id(cls) -> str:
        return str(uuid6.uuid7())
