import logging
from typing import List

from app.db.base import UoW
from app.db.ydb.request import RequestRepository
from app.models.request import Request, Status


class RequestService:
    def __init__(self, uow: UoW):
        self.request_repo: RequestRepository = uow.request_repo
        self.logger = logging.getLogger(__name__)

    async def get_requests_by_requested(self, user_id: str, fsp_id=None) -> List[Request]:
        print("get_requests_by_requested")
        print("user_id", user_id)
        print("fsp_id", fsp_id)
        try:
            requests = await self.request_repo.get_by_requested_id(user_id)
            if fsp_id:
                fsp_requests = await self.request_repo.get_by_requested_id(fsp_id)
                requests.extend(fsp_requests)
            return requests
        except Exception as e:
            self.logger.error(f"Ошибка при получении запросов по requested_id: {e}")
            raise

    async def get_requests_by_requester(self, user_id: str) -> List[Request]:
        try:
            requests = await self.request_repo.get_by_requester_id(user_id)
            return requests
        except Exception as e:
            self.logger.error(f"Ошибка при получении запросов по requester_id: {e}")
            raise

    async def respond_to_request(
        self, request_id: str, user_id: str, action: str
    ) -> Request:
        try:
            request = await self.get_request_by_id(request_id)
            if not self._has_permission_to_respond(request, user_id):
                raise ("У вас нет прав для изменения этого запроса.")
            if action == "accept":
                request.status = Status.accepted
            elif action == "reject":
                request.status = Status.rejected
            else:
                raise ValueError("Некорректное действие.")
            updated_request = await self.request_repo.update(request)
            return updated_request
        except Exception as e:
            self.logger.error(f"Ошибка при ответе на запрос: {e}")
            raise

    async def cancel_request(self, request_id: str, user_id: str) -> Request:
        try:
            request = await self.get_request_by_id(request_id)
            if request.requester_id != user_id:
                raise ("Вы не можете отменить этот запрос.")
            request.status = Status.cancelled
            updated_request = await self.request_repo.update(request)
            return updated_request
        except Exception as e:
            self.logger.error(f"Ошибка при отмене запроса: {e}")
            raise

    def _has_permission_to_respond(
        self, request: Request, user_id: str, user_role: str = None, fsp_id: str = None
    ) -> bool:
        if request.requested_id == user_id:
            return True
        # Дополнительная логика для fsp_manager
        # Проверяем, соответствует ли requested_id fsp_id пользователя
        # Предполагается, что есть метод get_fsp_id_by_user_id
        if user_role in [
            "fsp_manager",
            "superadmin",
            "fsp_regional_manager",
            "fsp_regional",
        ]:
            if request.requested_id == fsp_id:
                return True
        return False
        return False
        return False
