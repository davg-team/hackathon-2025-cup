# 📋 Applications API

API для управления заявками на участие в мероприятиях, с возможностью подачи заявок от капитанов, создания временных команд и подачи откликов от спортсменов.

---

## 🔗 Базовый URL

```
http://localhost:8080/api/applications
```

---

## 🧾 Основные понятия

-   **Application** — заявка от капитана на участие в мероприятии.
-   **TeamType** — тип команды:
    -   `temporary` — временная команда
    -   `permanent` — постоянная команда
    -   `solo` — индивидуальный участник
-   **ApplicationStatus** — статус заявки:
    -   `team` — временная команда в поиске участников
    -   `pending` — заявка на рассмотрении
    -   `approved` — заявка одобрена
    -   `denied` — заявка отклонена
-   **TeamApplication** — заявка от участника на вступление во временную команду.

---

## 📌 Эндпоинты

### ▶️ POST `/`

**Отправка заявки на участие в мероприятии**

**Request Body:**

```json
{
    "event_id": "test_id",
    "application_status": "pending",
    "team_id": "new_team_id",
    "team_type": "temporary",
    "captain_id": "01965c82-77fb-722f-b18a-30302e77cb3b",
    "members": ["uuid1", "uuid2"]
}
```

**Response:**

```json
{
    "id": "01965c82-77fb-722f-b18a-30302e77cb3b"
}
```

---

### 📄 GET `/`

**Получение списка заявок**

**Query параметры:**

-   `team_id` — фильтр по ID команды
-   `status` — фильтр по статусу заявки

**Response:** `200 OK` — список заявок (`ApplicationResponse[]`)

---

### 📄 GET `/{id}`

**Получение заявки по ID**

**Response:** `200 OK` — `ApplicationDetailResponse`

---

### 🔄 PATCH `/{id}/status`

**Изменение статуса заявки**

**Query параметр:**

-   `status` (обязательный) — новый статус заявки

**Response:**

```json
{ "status": "success" }
```

---

### 📄 GET `/team`

**Получение списка заявок в команды**

**Query параметры:**

-   `team_id`
-   `user_id`

**Response:** `200 OK` — список откликов (`TeamApplicationResponse[]`)

---

### ▶️ POST `/team`

**Подача заявки в команду**

**Request Body:**

```json
{
    "team_id": "cd9018b7-d916-4721-a772-69299b0a4004"
}
```

**Response:**

```json
{ "status": "success" }
```

---

### 📄 GET `/team/{id}`

**Получение заявки в команду по ID**

**Response:** `200 OK` — `TeamApplicationResponse`

---

### 🔄 PATCH `/team/{id}/status`

**Изменение статуса заявки в команду**

**Query параметр:**

-   `status` — `approved`, `pending`, `denied`

**Response:**

```json
{ "status": "success" }
```

---

## 🔐 Аутентификация

Большинство методов требуют **Bearer Token**:

```
Authorization: Bearer <token>
```

---

## 📚 Схемы данных

### ApplicationModel

-   `application_status`: `"team"` | `"pending"` | `"approved"` | `"denied"`
-   `team_type`: `"temporary"` | `"permanent"` | `"solo"`

### TeamApplicationModel

-   `application_state`: `"approved"` | `"pending"` | `"rejected"`

---
