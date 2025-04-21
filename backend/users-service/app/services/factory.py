from app.db.base import UoW

from .favorites import FavoritesService
from .filters import FiltersService
from .notification import NotificationService
from .relation import RelationService
from .requests import RequestService
from .user import UserService


class ServicesFactory:
    def __init__(self, uow: UoW):
        self.uow = uow

    def get_user_service(self) -> UserService:
        return UserService(self.uow)

    def get_relation_service(self) -> RelationService:
        return RelationService(self.uow)

    def get_filters_service(self) -> FiltersService:
        return FiltersService(self.uow)

    def get_favorites_service(self) -> FavoritesService:
        return FavoritesService(self.uow)

    def get_request_service(self) -> RequestService:
        return RequestService(self.uow)

    def get_notification_service(self) -> NotificationService:
        return NotificationService(self.uow)
