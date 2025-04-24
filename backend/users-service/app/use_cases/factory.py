from datetime import datetime

import requests

from app.db.base.unit_of_work import UoW
from app.models.notification import Notification

# from app.models.key import Key
from app.models.relation import Relation
from app.models.request import Request, RequestedType, RequesterType, Type
from app.models.request import Status as RequestStatus
from app.models.user import Role, Status, User


def role_to_str(role: Role):
    print("role", role)
    if type(role) != str:
        role = role.value
    match role:
        case "fsp_staff":
            return "Представитель ФСП"
        case "fsp_region_staff":
            return "Представитель регионального ФСП"
        case "fsp_region_head":
            return "Руководитель регионального ФСП"
        case "root":
            return "Администратор"
        case _:
            return "Неизвестная роль"


class UseCasesFactory:
    def __init__(self, uow: UoW):
        self.uow = uow

    async def create_user_from_provider(
        self, provider_slug, provider_user_id, provider_data
    ):
        """Создаёт нового пользователя и добавляет связь с провайдером
        Правила:
        1.
        """

        # TODO: Проверить логику создания пользователя и связи с провайдером

        from rich import print

        print(provider_slug, provider_user_id, provider_data)

        async with await self.uow() as u:
            user = User()
            user.id = User.generate_uuid()

            if provider_data.get("user_info"):
                match provider_slug:
                    case "yandex":
                        user.email = provider_data["user_info"]["default_email"]
                        sex = provider_data["user_info"]["sex"]
                        user.first_name = provider_data["user_info"]["first_name"]
                        user.last_name = provider_data["user_info"]["last_name"]
                        user.phone = (
                            provider_data["user_info"]["default_phone"]["number"]
                            if provider_data["user_info"].get("default_phone")
                            else None
                        )
                        avatar = (
                            provider_data["user_info"]["default_avatar_id"]
                            if not provider_data["user_info"]["is_avatar_empty"]
                            else None
                        )
                        if avatar:
                            user.avatar = f"https://avatars.yandex.net/get-yapic/{avatar}/islands-200"

                    case "rsaag":
                        user.snils = (
                            provider_data["user_info"].get("user", {}).get("esia_snils")
                        )

                    case "tg":
                        user.first_name = provider_data["user_info"]["first_name"]
                        user.last_name = provider_data["user_info"]["last_name"]
                        user.avatar = provider_data["user_info"]["photo_url"]
                        user.tg_id = provider_data["user_info"]["id"]
                        user.notification_ways.append("tg")

            user.roles = [Role.user]
            user.status = Status.active
            user.created_at = datetime.now()
            user.last_login_at = datetime.now()
            user.other_data = {}
            user.required.append("registration")

            if user.email:
                user.notification_ways.append("email")

            user = await u.user_repo.insert(user)

            relation = Relation()

            relation.id = Relation.generate_uuid()
            relation.provider_slug = provider_slug
            relation.provider_user_id = provider_user_id
            relation.provider_service = provider_data.get("provider_service")
            relation.user_id = user.id
            relation.linked_at = datetime.now()
            relation.used_at = datetime.now()

            await u.relation_repo.insert(relation)

            # TODO: сохранить токен провайдера в базе данных

        return user

    async def update_registr(
        self, user_id, email, first_name, last_name, second_name, region_id, role_request
    ):
        # TODO: Проверить логику обновления данных пользователя и добавления запроса на роль

        print("role_request", role_request)
        match role_request.value:
            case "fsp_staff":
                requested_id = "0"
            case "root":
                requested_id = "0"
            case "fsp_region_staff":
                requested_id = region_id
            case "sportsman":
                requested_id = region_id
            case "fsp_region_head":
                requested_id = "0"

        async with await self.uow() as u:
            user = await u.user_repo.get_by_id(user_id)
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.second_name = second_name
            user.status = Status.validation
            user.required.pop(user.required.index("registration"))
            user = await u.user_repo.update(user)

            request = Request()
            request.requester_id = user_id
            request.requester_type = RequesterType.user
            request.requested_id = requested_id
            request.requested_type = RequestedType.fsp
            request.type = Type.role
            request.subject = role_request.value
            request.status = RequestStatus.waiting
            request.comment = f"Запрос на изменение роли пользователя {first_name} {last_name} регион {region_id}"

            request = await u.request_repo.insert(request)

        # Записываем уведомление о запросе на изменение роли
        async with await self.uow() as u:
            notification = Notification()
            notification.type = "role_request"
            notification.text = f"Запрос на изменение роли пользователя {first_name} {last_name} на {role_to_str(role_request.value)} регион {region_id}"
            notification.sender = "system"
            notification.receiver_id = requested_id
            notification.sent_at = datetime.now()
            notification.read_at = None

            await u.notification_repo.insert(notification)

        return user

    async def role_request_response(self, action, request_id):
        """Ответ на запрос на изменение роли

        Roadmap:
        1. Получить запрос
        2. Изменить статус запроса
        3. Если запрос принят, изменить роль пользователя


        """

        async with await self.uow() as u:
            request = await u.request_repo.get_by_id(request_id)

            # Уведомление
            notification = Notification()
            notification.type = "role_request_response"
            notification.sender = "system"
            notification.receiver_id = request.requester_id
            print("notification.receiver_id", request.requester_id)

            notification.sent_at = datetime.now()
            notification.read_at = None
            if action == "accept":
                request.status = RequestStatus.accepted
                user = await u.user_repo.get_by_id(request.requester_id)
                user.roles = [Role(request.subject)] + user.roles
                user.status = Status.active
                user.region_id = request.requested_id
                user = await u.user_repo.update(user)

                notification.text = f"Ваш запрос на изменение роли принят. Теперь вы {role_to_str(request.subject)}. Вам необходимо перезайти в систему."
            elif action == "reject":
                request.status = RequestStatus.rejected

                notification.text = f"Ваш запрос на изменение роли отклонён. Пожалуйста, обратитесь в Федерацию."

            await u.notification_repo.insert(notification)

            request = await u.request_repo.update(request)
