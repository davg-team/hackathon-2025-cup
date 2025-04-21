import os

from app.db.base import UoW
from app.services import ServicesFactory
from app.use_cases import UseCasesFactory

from .crypto_manager import CryptoManager
from .settings import settings

crypto_manager = None


def get_crypto_manager():
    global crypto_manager
    if not crypto_manager:
        crypto_manager = CryptoManager(settings.crypto_settings)
    return crypto_manager


uow = None


def get_uow() -> UoW:
    """Возвращает uow"""
    global uow

    store = os.environ.get("APP_STORE_TYPE", settings.app_store_type)

    UoW = __import__(f"app.db.{store}.unit_of_work", fromlist=["app.db"]).UoW

    match store:
        case "ydb":
            uow = UoW(**settings.ydb_settings.model_dump())
        case _:
            raise ValueError("Unknown store type")

    return uow


# SERVICES

servises = ServicesFactory(get_uow())


def get_services_factory():
    return servises


def get_user_service():
    return servises.get_user_service()


def get_relation_service():
    return servises.get_relation_service()


def get_filters_service():
    return servises.get_filters_service()


def get_favorites_service():
    return servises.get_favorites_service()


def get_notification_service():
    return servises.get_notification_service()


# USE CASES

use_cases = UseCasesFactory(get_uow())


def get_use_cases_factory():
    return use_cases
    return use_cases
