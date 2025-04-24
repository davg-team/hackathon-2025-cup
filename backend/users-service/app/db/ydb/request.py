import json
import logging
from datetime import datetime

from app.models.request import Request, RequestedType, RequesterType, Status, Type

# from ..base import UserRepository as BaseUserRepository
from .repository import BaseRepository


class RequestRepository(BaseRepository):
    request_table = "requests"

    CREATE_USERS_TABLE = f"""
        CREATE TABLE {request_table}
        (
            id Utf8,
            created_at Datetime,
            type Utf8,
            status Utf8,
            requester_id Utf8,
            requester_type Utf8,
            requested_id Utf8,
            requested_type Utf8,
            subject Utf8,
            comment Utf8,
            updated_at Datetime,
            other_data Json,
            PRIMARY KEY (id)
        )
        WITH (
            AUTO_PARTITIONING_BY_SIZE = ENABLED,
            AUTO_PARTITIONING_BY_LOAD = ENABLED,
            AUTO_PARTITIONING_PARTITION_SIZE_MB = 2048,
            AUTO_PARTITIONING_MIN_PARTITIONS_COUNT = 1,
            KEY_BLOOM_FILTER = DISABLED
        );
    """

    async def insert(self, request: Request) -> Request:
        QUERY = f"""
        DECLARE $id AS Utf8;
        DECLARE $created_at AS Datetime;
        DECLARE $type AS Utf8;
        DECLARE $status AS Utf8;
        DECLARE $requester_id AS Utf8;
        DECLARE $requester_type AS Utf8;
        DECLARE $requested_id AS Utf8?;
        DECLARE $requested_type AS Utf8;
        DECLARE $subject AS Utf8;
        DECLARE $comment AS Utf8?;
        DECLARE $updated_at AS Datetime?;
        DECLARE $other_data AS Json?;
        INSERT INTO {self.request_table}
        (id, created_at, type, status, requester_id, requester_type, requested_id, requested_type, subject, comment, updated_at, other_data)
        VALUES
        ($id, $created_at, $type, $status, $requester_id, $requester_type, $requested_id, $requested_type, $subject, $comment, $updated_at, $other_data);
        """

        if not request.request_id:
            request.request_id = request.generate_uuid()

        if not request.created_at:
            request.created_at = datetime.now()

        request.updated_at = datetime.now()

        logging.info(
            {
                "$id": request.request_id,
                "$created_at": int(request.created_at.timestamp()),
                "$type": request.type.value,
                "$status": request.status.value,
                "$requester_id": request.requester_id,
                "$requester_type": request.requester_type.value,
                "$requested_id": request.requested_id,
                "$requested_type": request.requested_type.value,
                "$subject": request.subject,
                "$comment": request.comment,
                "$updated_at": int(request.updated_at.timestamp()),
                "$other_data": json.dumps(request.other_data)
                if request.other_data
                else None,
            }
        )

        async with self:
            await self.execute(
                QUERY,
                {
                    "$id": request.request_id,
                    "$created_at": int(request.created_at.timestamp()),
                    "$type": request.type.value,
                    "$status": request.status.value,
                    "$requester_id": request.requester_id,
                    "$requester_type": request.requester_type.value,
                    "$requested_id": request.requested_id,
                    "$requested_type": request.requested_type.value,
                    "$subject": request.subject,
                    "$comment": request.comment,
                    "$updated_at": int(request.updated_at.timestamp()),
                    "$other_data": json.dumps(request.other_data)
                    if request.other_data
                    else None,
                },
            )

        return request

    async def get_by_id(self, request_id) -> Request:
        QUERY = f"""
        DECLARE $request_id AS Utf8;
        SELECT * FROM {self.request_table} WHERE id = $request_id;
        """

        async with self:
            (r,) = await self.execute(QUERY, {"$request_id": request_id})

        row = r.rows[0]

        request = Request()
        request.request_id = row.id
        request.created_at = datetime.fromtimestamp(row.created_at)
        request.type = Type(row.type)
        request.status = Status(row.status)
        request.requester_id = row.requester_id
        print("request.requester_id repo", request.requester_id)
        request.requester_type = RequesterType(row.requester_type)
        request.requested_id = row.requested_id
        request.requested_type = RequestedType(row.requested_type)
        request.subject = row.subject
        request.comment = row.comment
        request.updated_at = datetime.fromtimestamp(row.updated_at)

        return request

    async def update(self, request: Request) -> Request:
        QUERY = f"""
        DECLARE $id AS Utf8;
        DECLARE $created_at AS Datetime;
        DECLARE $type AS Utf8;
        DECLARE $status AS Utf8;
        DECLARE $requester_id AS Utf8;
        DECLARE $requester_type AS Utf8;
        DECLARE $requested_id AS Utf8?;
        DECLARE $requested_type AS Utf8;
        DECLARE $subject AS Utf8;
        DECLARE $comment AS Utf8?;
        DECLARE $updated_at AS Datetime?;
        DECLARE $other_data AS Json?;
        UPDATE {self.request_table}
        SET
        created_at = $created_at,
        type = $type,
        status = $status,
        requester_id = $requester_id,
        requester_type = $requester_type,
        requested_id = $requested_id,
        requested_type = $requested_type,
        subject = $subject,
        comment = $comment,
        updated_at = $updated_at,
        other_data = $other_data
        WHERE id = $id;
        """

        async with self:
            await self.execute(
                QUERY,
                {
                    "$id": request.request_id,
                    "$created_at": int(request.created_at.timestamp()),
                    "$type": request.type.value,
                    "$status": request.status.value,
                    "$requester_id": request.requester_id,
                    "$requester_type": request.requester_type.value,
                    "$requested_id": request.requested_id,
                    "$requested_type": request.requested_type.value,
                    "$subject": request.subject,
                    "$comment": request.comment,
                    "$updated_at": int(request.updated_at.timestamp()),
                    "$other_data": json.dumps(request.other_data)
                    if request.other_data
                    else None,
                },
            )

        return request

    async def get_by_requester_id(self, requester_id) -> list[Request]:
        QUERY = f"""
        DECLARE $requester_id AS Utf8;
        SELECT * FROM {self.request_table} WHERE requester_id = $requester_id;
        """

        async with self:
            (r,) = await self.execute(QUERY, {"$requester_id": requester_id})

        requests = []

        for row in r.rows:
            request = Request()
            request.request_id = row.id
            request.created_at = datetime.fromtimestamp(row.created_at)
            request.type = Type(row.type)
            request.status = Status(row.status)
            request.requester_id = row.requester_id
            request.requester_type = RequesterType(row.requester_type)
            request.requested_id = row.requested_id
            request.requested_type = RequestedType(row.requested_type)
            request.subject = row.subject
            request.comment = row.comment
            request.updated_at = datetime.fromtimestamp(row.updated_at)

            requests.append(request)

        return requests

    async def get_by_requested_id(self, requested_id) -> list[Request]:
        QUERY = f"""
        DECLARE $requested_id AS Utf8;
        SELECT * FROM {self.request_table} WHERE requested_id = $requested_id;
        """

        async with self:
            (r,) = await self.execute(QUERY, {"$requested_id": requested_id})

        print("r", r.rows)

        requests = []

        for row in r.rows:
            request = Request()
            request.request_id = row.id
            request.created_at = datetime.fromtimestamp(row.created_at)
            request.type = Type(row.type)
            request.status = Status(row.status)
            request.requester_id = row.requester_id
            request.requester_type = RequesterType(row.requester_type)
            request.requested_id = row.requested_id
            request.requested_type = RequestedType(row.requested_type)
            request.subject = row.subject
            request.comment = row.comment
            request.updated_at = datetime.fromtimestamp(row.updated_at)

            requests.append(request)

        return requests
