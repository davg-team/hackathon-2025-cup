from app.db.base import UoW

# from app.models.user import User


class UserService:
    def __init__(self, uow: UoW):
        self.repository = uow.user_repo

    async def get_user_by_id(self, user_id):
        return await self.repository.get_by_id(user_id)

    async def update_user(self, user):
        return await self.repository.update(user)

    async def get_user_notification_settings(self, user_id):
        return await self.repository.get_user_notification_settings(user_id)

    async def get_users_notification_settings(self, fsp):
        if fsp == "0":
            roles = ["root", "fsp_staff"]
        else:
            roles = ["root", "fsp_staff", "fsp_head"]
        return await self.repository.get_users_notification_settings(
            region_id=fsp, roles=roles
        )
