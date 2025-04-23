# Структура базы данных

В этой секции описана детальная структура СУБД проекта на YDB — ключевые таблицы, их поля, связи, индексы и принципы хранения данных.

---

## Общее обоснование выбора YDB

- **Масштабируемость и распределённость**: YDB автоматически шардирует данные, обеспечивая линейный рост производительности при увеличении нагрузки.
- **Высокая доступность**: репликация и синхронный журнал транзакций обеспечивают устойчивость к сбоям.
- **Автоматическое партиционирование**: встроенные политики AUTO_PARTITIONING позволяют оптимизировать хранение по объёму и нагрузке.
- **Поддержка ACID**: гарантированная целостность транзакций даже в распределённом окружении.
- **Интеграция JSON**: удобное хранение гибких структур (например, `members`, `roles`, `notification_ways`).

---

## Принципы хранения и обработки данных

- **Партиционирование**: все таблицы имеют включённые опции AUTO_PARTITIONING_BY_SIZE, что позволяет YDB автоматически управлять числом шардов.
- **Ключи Bloom Filter**: по умолчанию отключены; при необходимости можно включить для ускорения точечных запросов.
- **Индексы**: первичные ключи по полям `id` или составным ключам; для часто фильтруемых полей (например, `event_id`, `user_id`, `team_id`) рекомендуется создавать вторичные индексы.
- **JSON-поля**: для гибких настроек и вложенных структур используются поля типа `Json`.
<!-- - **Типы времени**: `Timestamp` для отметок создания, `Datetime` для логов аудита и чтения. -->
- **Soft‑delete (при необходимости)**: через поле status или дополнительный deleted_at.

---

## Таблицы и их описание

[![](https://img.plantuml.biz/plantuml/svg/bLLBRjim4DqBq1s8R0eKSDP5La6HRhfCsxKmaCOk0Oeao74AD_8PUePUePls6EwDElh46bAAasuCSVY6yzwR8NqR2GBjMwC-tD-LHLcW9Kq7jOyOedei2wNU3ejAD-f6VQ7jkpwssVI_MnqYLHPQ55i6bh68jRDD7iKMj15h_zLPkGyFmEH48E1EEvio2SvWvFN7w6o_jexqLjT0FV8R7EGUQwLz5CbrG21iAY0Etl4dwHRBuYYC66kUhLXn8L4bKrtOWTNV1ogN3cXqfA1hMYWLWHOix30ywvwiYm_ySQcW99QwoVb6je0ENYwPQQszqKcRXWcg6dQFWv_PG0wqVg38FL-BwrWvZxsyzywPbSv8DOJGljf-dideKqarU0ATw9J7WsSzzOiz6ZpDl69YBvPIia1rUG25Hxa1rIjfBZbDYJdvd1N-9wc0SM-o8Vl4KsntgvxDM_DRCiTcrdFC6wXHH8RYRzJfv-dNtn-dtwS_PJ6-KSVk-hfxFD_J6tLrVYQkoYAzWnDskY0CpMu29qnx4pAndV5FaXWupkKpk4bH3bksCi4cWdBOF5mvSlLKsNTEUEhNiTjikauu81HbcB46GwQMBH6ZjaJ2BTzv_ZVv1m00)](https://editor.plantuml.com/uml/bLLBRjim4DqBq1s8R0eKSDP5La6HRhfCsxKmaCOk0Oeao74AD_8PUePUePls6EwDElh46bAAasuCSVY6yzwR8NqR2GBjMwC-tD-LHLcW9Kq7jOyOedei2wNU3ejAD-f6VQ7jkpwssVI_MnqYLHPQ55i6bh68jRDD7iKMj15h_zLPkGyFmEH48E1EEvio2SvWvFN7w6o_jexqLjT0FV8R7EGUQwLz5CbrG21iAY0Etl4dwHRBuYYC66kUhLXn8L4bKrtOWTNV1ogN3cXqfA1hMYWLWHOix30ywvwiYm_ySQcW99QwoVb6je0ENYwPQQszqKcRXWcg6dQFWv_PG0wqVg38FL-BwrWvZxsyzywPbSv8DOJGljf-dideKqarU0ATw9J7WsSzzOiz6ZpDl69YBvPIia1rUG25Hxa1rIjfBZbDYJdvd1N-9wc0SM-o8Vl4KsntgvxDM_DRCiTcrdFC6wXHH8RYRzJfv-dNtn-dtwS_PJ6-KSVk-hfxFD_J6tLrVYQkoYAzWnDskY0CpMu29qnx4pAndV5FaXWupkKpk4bH3bksCi4cWdBOF5mvSlLKsNTEUEhNiTjikauu81HbcB46GwQMBH6ZjaJ2BTzv_ZVv1m00)

### 1. `applications`
- **Назначение**: хранение заявок (индивидуальных и командных) на участие в соревнованиях.
- **Поля**:
  - `id` (Utf8) – PK
  - `event_id` (Utf8) – FK → `events.id` (индекс)
  - `application_status` (Utf8) – enum: \"team\", \"approved\", \"denied\", \"pending\"
  - `team_id` (Utf8, nullable) – FK → `teams.id`
  - `team_type` (Utf8) – \"solo\", \"temporary\" или \"permanent\"
  - `members` (Utf8) – JSON-строка с массивом идентификаторов участников
  - `captain_id` (Utf8, nullable) – FK → `users.user_id`
  - `team_name` (Utf8) – отображаемое имя команды
  - `created_at` (Timestamp) – время создания заявки
- **PK**: `id`
- **Индексы**: по `event_id`, `captain_id`, `application_status`

### 2. `auth_provider_relations`
- **Назначение**: связи учётных записей с внешними провайдерами (OAuth).
- **Поля**:
  - `provider_slug` (Utf8) – PK часть
  - `provider_service` (Utf8)
  - `provider_user_id` (Utf8) – PK часть
  - `user_id` (Utf8) – FK → `users.user_id`
  - `linked_at` (Datetime)
  - `used_at` (Datetime)
- **PK**: (`provider_slug`, `provider_user_id`)
- **Индексы**: по `user_id`

### 3. `events`
- **Назначение**: описание соревнований.
- **Поля**:
  - `id` (Utf8) – PK
  - `organization_id` (Utf8) – FK → `organizations.id`
  - `title` (Utf8)
  - `type` (Utf8) – \"open\", \"regional\", \"federal\"
  - `discipline` (Utf8)
  - `start_date` (Timestamp)
  - `end_date` (Timestamp)
  - `is_open` (Bool)
  - `status` (Utf8) – \"draft\", \"published\", \"archived\"
  - `regions` (Utf8) – JSON-массив кодов регионов
  - `min_people`/`max_people` (Uint32)
  - `description` (Utf8)
  - `protocol_s3_key` (Utf8)
  - `event_image_s3_key` (Utf8)
  - `min_age`/`max_age` (Uint32)
- **PK**: `id`
- **Индексы**: по `organization_id`, `type`, `discipline`, `status`

### 4. `notifications`
- **Назначение**: хранение уведомлений пользователей.
- **Поля**:
  - `id` (Utf8) – PK
  - `type` (Utf8)
  - `text` (Utf8)
  - `sender_id` (Utf8) – FK → `users.user_id`
  - `receiver_id` (Utf8) – FK → `users.user_id`
  - `sent_at` (Datetime)
  - `read_at` (Datetime, nullable)
- **PK**: `id`
- **Индексы**: по `receiver_id`, `sender_id`, `sent_at`

### 5. `organizations`
- **Назначение**: справочник региональных и центральной ФСП.
- **Поля**:
  - `id` (Utf8) – PK
  - `district` (Utf8)
  - `region` (Utf8)
  - `manager` (Utf8) – FK → `users.user_id`
  - `email` (Utf8)
  - `description` (Utf8)
- **PK**: `id`
- **Индексы**: по `region`

### 6. `requests`
- **Назначение**: хранение запросов на изменение ролей, прав и пр.
- **Поля**:
  - `id` (Utf8) – PK
  - `type` (Utf8)
  - `subject` (Utf8)
  - `status` (Utf8)
  - `requester_id` (Utf8) – FK → `users.user_id`
  - `requester_type` (Utf8)
  - `requested_id` (Utf8)
  - `requested_type` (Utf8)
  - `comment` (Utf8)
  - `other_data` (Json)
  - `created_at`/`updated_at` (Datetime)
- **PK**: `id`
- **Индексы**: по `requester_id`, `status`

### 7. `results`
- **Назначение**: итоговые результаты соревнований.
- **Поля**:
  - `id` (String) – PK
  - `event_id` (String) – FK → `events.id`
  - `user_id` (String, nullable) – FK → `users.user_id`
  - `team_id` (String, nullable) – FK → `teams.id`
  - `place` (String)
- **PK**: `id`
- **Индексы**: по `event_id`, `user_id`, `team_id`

### 8. `team_applications`
- **Назначение**: запросы спортсменов на вступление в формирующуюся команду.
- **Поля**:
  - `id` (Utf8) – PK
  - `team_id` (Utf8) – FK → `teams.id`
  - `applicant_id` (Utf8) – FK → `users.user_id`
  - `application_state` (Utf8)
  - `created_at` (Timestamp)
- **PK**: `id`
- **Индексы**: по `team_id`, `applicant_id`, `application_state`

### 9. `users`
- **Назначение**: учётные записи и профили пользователей.
- **Поля**:
  - `user_id` (Utf8) – PK
  - `first_name`, `last_name`, `second_name` (Utf8)
  - `email` (Utf8)
  - `phone` (Utf8)
  - `avatar` (Utf8)
  - `region_id` (Utf8) – FK → `organizations.region`
  - `tg_id`, `snils` (Utf8)
  - `roles` (Json)
  - `status` (Utf8)
  - `required`, `notification_ways` (Json)
  - `created_at`, `last_login_at` (Datetime)
  - `other_data` (Json)
- **PK**: `user_id`
- **Индексы**: по `email`, `region_id`, `status`

