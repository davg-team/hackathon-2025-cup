import json
from datetime import datetime
from typing import Any

from app.models.user import Role, Status, User

from ..base import UserRepository as BaseUserRepository
from .repository import BaseRepository


class UserRepository(BaseRepository, BaseUserRepository):
    users_table = "users"

    CREATE_USERS_TABLE = f"""
        CREATE TABLE {users_table}
        (
            user_id Utf8,
            first_name Utf8,
            last_name Utf8,
            second_name Utf8,
            email Utf8,
            phone Utf8,
            avatar Utf8,
            region_id Utf8,
            tg_id Utf8,
            snils Utf8,
            roles Json,
            status Utf8,
            required Json,
            notification_ways Json,
            created_at Datetime,
            last_login_at Datetime,
            other_data Json,
            PRIMARY KEY (user_id)
        )
        WITH (
            AUTO_PARTITIONING_BY_SIZE = ENABLED,
            AUTO_PARTITIONING_BY_LOAD = ENABLED,
            AUTO_PARTITIONING_PARTITION_SIZE_MB = 2048,
            AUTO_PARTITIONING_MIN_PARTITIONS_COUNT = 1,
            KEY_BLOOM_FILTER = DISABLED
        );
    """

    async def insert(self, user: User) -> User:
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $first_name AS Utf8?;
        DECLARE $last_name AS Utf8?;
        DECLARE $second_name AS Utf8?;
        DECLARE $email AS Utf8?;
        DECLARE $phone AS Utf8?;
        DECLARE $avatar AS Utf8?;
        DECLARE $region_id AS Utf8?;
        DECLARE $tg_id AS Utf8?;
        DECLARE $snils AS Utf8?;
        DECLARE $roles AS Json?;
        DECLARE $status AS Utf8?;
        DECLARE $required AS Json?;
        DECLARE $notification_ways AS Json?;
        DECLARE $created_at AS Datetime?;
        DECLARE $last_login_at AS Datetime?;
        DECLARE $other_data AS Json?;

        UPSERT INTO {self.users_table}
        (
            user_id,
            first_name,
            last_name,
            second_name,
            email,
            phone,
            avatar,
            region_id,
            tg_id,
            snils,
            roles,
            status,
            required,
            notification_ways,
            created_at,
            last_login_at,
            other_data
        )
        VALUES
        (
            $user_id,
            $first_name,
            $last_name,
            $second_name,
            $email,
            $phone,
            $avatar,
            $region_id,
            $tg_id,
            $snils,
            $roles,
            $status,
            $required,
            $notification_ways,
            $created_at,
            $last_login_at,
            $other_data
        );
        """

        if not user.id:
            user.id = user.generate_uuid()

        if not user.created_at:
            user.created_at = datetime.now()

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user.id,
                    "$first_name": user.first_name,
                    "$last_name": user.last_name,
                    "$second_name": user.second_name,
                    "$email": user.email,
                    "$phone": user.phone,
                    "$avatar": user.avatar,
                    "$region_id": user.region_id,
                    "$tg_id": str(user.tg_id),
                    "$snils": user.snils,
                    "$roles": json.dumps([role.value for role in user.roles]),
                    "$status": user.status.value if user.status else None,
                    "$required": json.dumps(user.required),
                    "$notification_ways": json.dumps(user.notification_ways),
                    "$created_at": int(user.created_at.timestamp()),
                    "$last_login_at": int(user.last_login_at.timestamp())
                    if user.last_login_at
                    else None,
                    "$other_data": json.dumps(user.other_data),
                },
            )

        return user

    async def get_by_id(self, user_id) -> User:
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        SELECT * FROM {self.users_table}
        WHERE user_id = $user_id;
        """
        async with self:
            (r,) = await self.execute(QUERY, {"$user_id": user_id})

        row = r.rows[0]
        user = User()

        user.id = row.user_id
        user.first_name = row.first_name
        user.last_name = row.last_name
        user.second_name = row.second_name
        user.email = row.email
        user.phone = row.phone
        user.avatar = row.avatar
        user.region_id = row.region_id
        user.tg_id = row.tg_id
        user.snils = row.snils
        user.roles = [Role(role) for role in json.loads(row.roles)] if row.roles else []
        user.status = Status(row.status) if row.status else None
        user.required = json.loads(row.required) if row.required else []
        user.notification_ways = (
            json.loads(row.notification_ways) if row.notification_ways else []
        )
        user.created_at = datetime.fromtimestamp(row.created_at)
        user.last_login_at = (
            datetime.fromtimestamp(row.last_login_at) if row.last_login_at else None
        )
        user.other_data = json.loads(row.other_data)

        return user

    async def update(self, user: User) -> User:
        QUERY = f"""
        DECLARE $user_id AS Utf8;
        DECLARE $first_name AS Utf8?;
        DECLARE $last_name AS Utf8?;
        DECLARE $second_name AS Utf8?;
        DECLARE $email AS Utf8?;
        DECLARE $phone AS Utf8?;
        DECLARE $avatar AS Utf8?;
        DECLARE $region_id AS Utf8?;
        DECLARE $tg_id AS Utf8?;
        DECLARE $snils AS Utf8?;
        DECLARE $roles AS Json?;
        DECLARE $status AS Utf8?;
        DECLARE $required AS Json?;
        DECLARE $notification_ways AS Json?;
        DECLARE $created_at AS Datetime?;
        DECLARE $last_login_at AS Datetime?;
        DECLARE $other_data AS Json?;

        UPDATE {self.users_table}
        SET
            first_name = $first_name,
            last_name = $last_name,
            second_name = $second_name,
            email = $email,
            phone = $phone,
            avatar = $avatar,
            region_id = $region_id,
            tg_id = $tg_id,
            snils = $snils,
            roles = $roles,
            status = $status,
            required = $required,
            notification_ways = $notification_ways,
            created_at = $created_at,
            last_login_at = $last_login_at,
            other_data = $other_data
        WHERE user_id = $user_id;
        """

        async with self:
            await self.execute(
                QUERY,
                {
                    "$user_id": user.id,
                    "$first_name": user.first_name,
                    "$last_name": user.last_name,
                    "$second_name": user.second_name,
                    "$email": user.email,
                    "$phone": user.phone,
                    "$avatar": user.avatar,
                    "$region_id": user.region_id,
                    "$tg_id": str(user.tg_id),
                    "$snils": user.snils,
                    "$roles": json.dumps([role.value for role in user.roles]),
                    "$status": user.status.value if user.status else None,
                    "$required": json.dumps(user.required),
                    "$notification_ways": json.dumps(user.notification_ways),
                    "$created_at": int(user.created_at.timestamp()),
                    "$last_login_at": int(user.last_login_at.timestamp())
                    if user.last_login_at
                    else None,
                    "$other_data": json.dumps(user.other_data),
                },
            )

        return user

    async def get_user_notification_settings(self, user_id: str) -> dict:
        QUERY = """
        DECLARE $user_id AS Utf8;
        SELECT notification_ways, tg_id, email FROM users WHERE user_id = $user_id;
        """

        async with self:
            (r,) = await self.execute(QUERY, {"$user_id": user_id})

        row = r.rows[0]

        settings = {
            "notification_ways": json.loads(row.notification_ways),
        }

        if "tg" in settings["notification_ways"]:
            settings["tg_id"] = row.tg_id

        if "email" in settings["notification_ways"]:
            settings["email"] = row.email

        return settings

    async def get_users_notification_settings(self, region_id: str, roles: list) -> list:
        QUERY = """
        DECLARE $region_id AS Utf8;
        SELECT user_id, notification_ways, tg_id, email FROM users
        WHERE region_id = $region_id AND (
            CAST(roles AS String) LIKE "%root%" OR
            CAST(roles AS String) LIKE "%fsp_staff%" OR
            CAST(roles AS String) LIKE "%fsp_head%"
        );
        """
        # (callable проверяет чтоб хотя бы одна роль из roles была в списке user_roles)

        async with self:
            (r,) = await self.execute(QUERY, {"$region_id": region_id, "$roles": roles})

        settings = []

        for row in r.rows:
            user_settings = {
                "user_id": row.user_id,
                "notification_ways": row.notification_ways,
            }

            if "tg" in user_settings["notification_ways"]:
                user_settings["tg_id"] = row.tg_id

            if "email" in user_settings["notification_ways"]:
                user_settings["email"] = row.email

            settings.append(user_settings)

        return settings

    async def get_users_by_ids(self, ids: list[str]) -> list[User]:
        if not ids:
            return []

        QUERY = f"""
        DECLARE $user_ids AS List<Utf8>;
        SELECT * FROM {self.users_table}
        WHERE user_id IN $user_ids;
        """

        async with self:
            (r,) = await self.execute(QUERY, {"$user_ids": ids})

        users = []
        for row in r.rows:
            user = User()
            user.id = row.user_id
            user.first_name = row.first_name
            user.last_name = row.last_name
            user.second_name = row.second_name
            user.email = row.email
            # user.phone = row.phone
            user.avatar = row.avatar
            user.region_id = row.region_id
            # user.tg_id = row.tg_id
            # user.snils = row.snils
            user.roles = (
                [Role(role) for role in json.loads(row.roles)] if row.roles else []
            )
            # user.status = Status(row.status) if row.status else None
            # user.required = json.loads(row.required) if row.required else []
            # user.notification_ways = (
            #     json.loads(row.notification_ways) if row.notification_ways else []
            # )
            # user.created_at = datetime.fromtimestamp(row.created_at)
            # user.last_login_at = (
            #     datetime.fromtimestamp(row.last_login_at) if row.last_login_at else None
            # )
            # user.other_data = json.loads(row.other_data) if row.other_data else {}
            users.append(user)

        return users
