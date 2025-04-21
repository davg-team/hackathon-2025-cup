import json
from datetime import datetime

from app.models.user import Role, User

from ..base import UserRepository as BaseUserRepository
from .repository import BaseRepository


class FiltersRepository(BaseRepository):
    users_table = "filters"

    CREATE_USERS_TABLE = f"""
        CREATE TABLE {users_table}
        (
            user_id Utf8,
            filter Utf8,
            created_at Datetime,
            other_data Json,
            PRIMARY KEY (user_id, filter)
        )
        WITH (
            AUTO_PARTITIONING_BY_SIZE = ENABLED,
            AUTO_PARTITIONING_BY_LOAD = ENABLED,
            AUTO_PARTITIONING_PARTITION_SIZE_MB = 2048,
            AUTO_PARTITIONING_MIN_PARTITIONS_COUNT = 1,
            KEY_BLOOM_FILTER = DISABLED
        );
    """

    async def insert(self, filter_: str, user_id: str):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $filter AS Utf8;
        DECLARE $created_at AS Datetime;
        -- DECLARE $other_data AS Json;
        INSERT INTO {self.users_table}
        (user_id, filter, created_at)
        VALUES
        ($user_id, $filter, $created_at);
        """

        created_at = datetime.now()

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user_id,
                    "$filter": filter_,
                    "$created_at": int(created_at.timestamp()),
                    # "$other_data": json.dumps(user.other_data),
                },
                commit_tx=True,
            )

        return filter_

    async def get_by_user_id(self, user_id):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        SELECT filter FROM {self.users_table}
        WHERE user_id = $user_id;
        """
        async with self:
            (r,) = await self.execute(QUERY, {"$user_id": user_id})

        filters = []
        for f in r.rows:
            print(f)

            filters.append(f["filter"])

        return filters

    async def delete(self, filter_: str, user_id: str):
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $filter AS Utf8;
        DELETE FROM {self.users_table}
        WHERE user_id = $user_id AND filter = $filter;
        """

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user_id,
                    "$filter": filter_,
                },
                commit_tx=True,
            )

        return filter_
