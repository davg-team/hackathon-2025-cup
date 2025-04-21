from app.db.base import UoW

# from app.models.user import User


class FiltersService:
    def __init__(self, uow: UoW):
        self.repository = uow.filters_repo

    async def get_by_user_id(self, user_id):
        return await self.repository.get_by_user_id(user_id)

    async def insert(self, filter_: str, user_id: str):
        return await self.repository.insert(filter_, user_id)

    async def delete(self, filter_: str, user_id: str):
        return await self.repository.delete(filter_, user_id)
