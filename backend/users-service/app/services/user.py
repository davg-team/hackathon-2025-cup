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

    async def get_users_by_ids(self, ids):
        return await self.repository.get_users_by_ids(ids)

    async def get_users_by_filters(
        self,
        date_filter: str = None,
        created_after=None,
        region_id: str = None,
        role: str = None,
        status_: str = None,
    ):
        return await self.repository.get_users_by_filters(
            date_filter=date_filter,
            created_after=created_after,
            region_id=region_id,
            role=role,
            status_=status_,
        )
