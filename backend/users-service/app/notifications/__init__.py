import asyncio
import json
import sys

import httpx

from app.core.dependencies import get_user_service

try:
    from .conf import token
except:
    pass

# sys.path.append("C:/dev/hackathon-2024/backend/users-service")
from .email_sender import send_email


async def send_tg_notification(tg_id, msg):
    print("Sending to tg", tg_id, msg)
    chat_id = tg_id

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = {"chat_id": chat_id, "text": msg}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data)

    print(response.json())


async def send_email_notification(email, msg):
    print("Sending to email", email, msg)
    send_email(
        to_email=email,
        subject="Уведомление",
        template_name="notification_email.html",
        context={"message": msg},
    )


async def send_notifications_to_users(key, notification, receivers):
    print("")
    print("")
    print("")
    print("Sending notifications to users")
    print("")
    print("")
    print(key, notification, receivers)
    # ['65249233-cf5e-4744-8692-cf4eb7f6e5b5'] {'read_at': None, 'sent_at': '2024-12-13T06:41:03.000000Z', 'receiver_id': '0193be98-7166-759d-b070-ca2825dbcc58', 'type': 'role_request_response', 'text': 'Ваш запрос на изменение роли принят. Теперь вы Role.fsp_staff. Вам необходимо перезайти в систему.', 'sender_id': 'system'} [{'notification_ways': ['tg'], 'tg_id': '493431536'}]

    msg = notification["text"]

    for receiver in receivers:
        print(receiver)
        if "tg" in receiver["notification_ways"]:
            print("Sending to tg")
            # Отправляем в телеграм
            await send_tg_notification(receiver["tg_id"], msg)

        if "email" in receiver["notification_ways"]:
            print("Sending to email")
            # Отправляем на почту
            await send_email_notification(receiver["email"], msg)


async def handle_event(event):
    """Обрабатываем уведомление"""

    key = event.get("key", [])

    notification = event.get("update", {})

    needs_to_be_set = ["read_at", "sent_at", "receiver_id", "type", "text", "sender_id"]

    if all(k in notification for k in needs_to_be_set):
        print("All fields are present")

        if notification["read_at"] is None:
            print("Notification is not read")
            # Отправляем уведомление
            print(f"Sending notification to {notification['receiver_id']}")
            receivers = []

            # receivers = [
            #     {
            #         "id": "0193be98-7166-759d-b070-ca2825dbcc58",
            #         "ways": ["email", "tg"],
            #         "email": "kolyadin.2007@ya.ru",
            #         "tg": "493431536",
            #     }
            # ]

            user_service = get_user_service()
            if len(notification["receiver_id"]) < 5:
                # Получаем всех кто принадлежит к роли и региону

                notification_settings = (
                    await user_service.get_users_notification_settings(
                        notification["receiver_id"]
                    )
                )
                print(notification_settings)

                receivers.extend(notification_settings)

            else:
                user_id = notification["receiver_id"]
                # Получаем пользователя по id

                notification_settings = await user_service.get_user_notification_settings(
                    user_id
                )
                # {'notification_ways': ['tg'], 'tg_id': '493431536'}
                print(notification_settings)

                receivers.append(notification_settings)

            await send_notifications_to_users(key, notification, receivers)


def handler(event, context):
    print(event)
    print(context)

    # event = {
    #     "messages": [
    #         {
    #             "update": {
    #                 "read_at": None,
    #                 "sent_at": "2024-12-13T06:41:03.000000Z",
    #                 "receiver_id": "0",
    #                 "type": "role_request_response",
    #                 "text": "Тестовое уведомление",
    #                 "sender_id": "system",
    #             },
    #             "key": ["65249233-cf5e-4744-8692-cf4eb7f6e5b5"],
    #         },
    #         # {
    #         #     "update": {
    #         #         "read_at": None,
    #         #         "sent_at": "2024-12-13T06:41:03.000000Z",
    #         #         "receiver_id": "0",
    #         #         "type": "role_request_response",
    #         #         "text": "Ваш запрос на изменение роли принят. Теперь вы Role.fsp_staff. Вам необходимо перезайти в систему.",
    #         #         "sender_id": "system",
    #         #     },
    #         #     "key": ["65249233-cf5e-4744-8692-cf4eb7f6e5b5"],
    #         # },
    #     ]
    # }

    tasks = []
    events = event.get("messages", [])
    for event in events:
        key = event.get("key", [])
        for k in key:
            print(k)
            tasks.append(handle_event(event))

    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.gather(*tasks))

    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}


# if __name__ == "__main__":
#     handler(
#         {
#             "messages": [
#                 {
#                     "update": {
#                         "read_at": None,
#                         "sent_at": "2024-12-13T06:41:03.000000Z",
#                         "receiver_id": "0193be98-7166-759d-b070-ca2825dbcc58",
#                         "type": "role_request_response",
#                         "text": "Ваш запрос на изменение роли принят. Теперь вы Role.fsp_staff. Вам необходимо перезайти в систему.",
#                         "sender_id": "system",
#                     },
#                     "key": ["65249233-cf5e-4744-8692-cf4eb7f6e5b5"],
#                 }
#             ]
#         },
#         {},
#     )
