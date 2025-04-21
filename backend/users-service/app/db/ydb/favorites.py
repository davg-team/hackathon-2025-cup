import json
from datetime import datetime

from app.models.user import Role, User

from ..base import UserRepository as BaseUserRepository
from .repository import BaseRepository


class FavoritesRepository(BaseRepository):
    users_table = "favorites"

    CREATE_USERS_TABLE = f"""
        CREATE TABLE {users_table}
        (
            user_id Utf8,
            event_id Utf8,
            created_at Datetime,
            other_data Json,
            PRIMARY KEY (user_id, event_id)
        )
        WITH (
            AUTO_PARTITIONING_BY_SIZE = ENABLED,
            AUTO_PARTITIONING_BY_LOAD = ENABLED,
            AUTO_PARTITIONING_PARTITION_SIZE_MB = 2048,
            AUTO_PARTITIONING_MIN_PARTITIONS_COUNT = 1,
            KEY_BLOOM_FILTER = DISABLED
        );
    """

    async def insert(self, event_id: str, user_id: str):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $event_id AS Utf8;
        DECLARE $created_at AS Datetime;
        -- DECLARE $other_data AS Json;
        INSERT INTO {self.users_table}
        (user_id, event_id, created_at)
        VALUES
        ($user_id, $event_id, $created_at);
        """

        created_at = datetime.now()

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user_id,
                    "$event_id": event_id,
                    "$created_at": int(created_at.timestamp()),
                    # "$other_data": json.dumps(user.other_data),
                },
                commit_tx=True,
            )

        return event_id

    async def get_by_user_id(self, user_id):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        SELECT event_id FROM {self.users_table}
        WHERE user_id = $user_id;
        """
        async with self:
            (r,) = await self.execute(QUERY, {"$user_id": user_id})

        event_ids = []
        for f in r.rows:
            print(f)

            event_ids.append(f["event_id"])

        return event_ids

    async def delete(self, event_id: str, user_id: str):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $event_id AS Utf8;
        DELETE FROM {self.users_table}
        WHERE user_id = $user_id AND event_id = $event_id;
        """

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user_id,
                    "$event_id": event_id,
                },
                commit_tx=True,
            )

        return event_id
