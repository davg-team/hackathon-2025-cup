from app.db.base import UoW

# from app.models.user import User


class FavoritesService:
    def __init__(self, uow: UoW):
        self.repository = uow.favorites_repo

    async def get_by_user_id(self, user_id):
        return await self.repository.get_by_user_id(user_id)

    async def insert(self, event_id: str, user_id: str):
        return await self.repository.insert(event_id, user_id)

    async def delete(self, event_id: str, user_id: str):
        return await self.repository.delete(event_id, user_id)
