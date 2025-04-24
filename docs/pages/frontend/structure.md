# Структура проекта

Фронтенд проект АИС «Федерация Спортивного Программирования» имеет чёткую организацию файлов и директорий, обеспечивающую масштабируемость и удобство разработки.

## Корневая структура

```
frontend/
├── index.html            # Основной HTML-файл
├── package.json          # Конфигурация NPM, зависимости
├── tsconfig.json         # Конфигурация TypeScript
├── vite.config.ts        # Конфигурация сборщика Vite
└── src/                  # Исходный код приложения
```

### Корневые файлы

- **index.html**  
  Содержит базовую разметку, мета-теги, подключение внешних скриптов:
  - Yandex.Metrika для аналитики
  - Скрипты для визуального эффекта "снег"
  - Yandex Passport SDK для авторизации

- **src/main.tsx**  
  Точка входа в React-приложение, подключающая корневой компонент App:
  ```tsx
  import { createRoot } from "react-dom/client";
  import App from "./app";
  
  createRoot(document.getElementById("root")!).render(<App />);
  ```

## Директории исходного кода

### app

Содержит корневые компоненты и настройки приложения:

- **app/index.tsx**  
  Корневой компонент приложения с основными провайдерами:
  - ThemeProvider для управления темой
  - PageConstructorProvider для конструктора страниц
  - ToasterProvider для уведомлений
  - AppContextProvider для глобального контекста

- **app/Context/**  
  Глобальный контекст приложения с состояниями:
  - Аутентификации пользователя
  - Провайдеров авторизации
  - Настройки темы и визуальных эффектов

- **app/Router/**  
  Конфигурация маршрутизации с обработкой субдоменов для регионов:
  ```tsx
  <BrowserRouter>
    <Routes>
      <Route path="/403" element={<Page403 />} />
      <Route path="/404" element={<Page404 />} />
      // ...более 20 маршрутов
      <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>
  ```

- **app/styles/**  
  Глобальные стили приложения:
  - reset.css — сброс стилей браузера
  - vars.css — переменные CSS
  - styles.css — общие стили и настройки тем
  - index.css — импорт других стилей

### api

Модули для взаимодействия с серверным API:

- **api/auth.ts**  
  Функции для работы с аутентификацией:
  ```typescript
  export async function updateToken(token: string|null) {
    const url = "/api/auth/account/token";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Обработка ответа...
  }
  ```

- **api/events.ts**  
  Функции для работы с мероприятиями:
  ```typescript
  export async function fetchEvents(region: string): Promise<Event[] | null> {
    const url = `/api/events?status=verified&${
      region ? "organization_id=" + region : ""
    }`;
    const response = await fetch(url);
    // Обработка ответа...
  }
  ```

### features/components

Переиспользуемые компоненты интерфейса:

- **Calendar/** — компоненты календаря на базе FullCalendar
- **CalendarView/** — специализированные представления календаря
- **Chart/** — компоненты для отрисовки диаграмм
- **Events/** — компоненты для отображения событий
- **LinkCustom/** — кастомные ссылки
- **LoginButton/** — компонент входа в систему
- **LoginCallback/** — обработчик колбэка авторизации
- **Logout/** — компонент для выхода из системы
- **Navigation/** — компоненты навигационного меню
- **NitificationsInsidePopup/** — компонент уведомлений
- **PageConstr/** — конструктор страниц
- **User/** — компонент профиля пользователя

### pages

Страницы приложения, соответствующие маршрутам:

- **403/, 404/** — страницы ошибок
- **AcceptEvents/, AddEvent/, AddReport/** — страницы для работы с событиями
- **AfterRegistration/** — страница после регистрации
- **Analitycs/** — страница аналитики
- **Applications/** — страница заявок
- **Competitions/, CompetitionTeamRegister/** — страницы соревнований
- **EventMainContent/, EventsMainContent/** — страницы событий
- **FederalCalendar/** — федеральный календарь
- **Landing/** — главная страница
- **MainContentLK/** — личный кабинет
- **MyCompetitions/** — мои соревнования
- **People/** — страница пользователей
- **Profile/** — профиль пользователя
- **Region/, Regions/** — страницы регионов
- **Team/, TeamAnalytics/, TeamEvents/, TeamMainContent/, Teams/** — страницы команд
- **TrackEventsMainContent/** — отслеживание событий
- **UserProfile/** — профиль пользователя

### shared

Переиспользуемые утилиты и константы:

- **shared/data/index.ts**  
  Константы и справочники данных:
  - Список регионов с кодами
  - Федеральные округа
  - Типы мероприятий
  - Дисциплины

- **shared/jwt-tools/index.ts**  
  Инструменты для работы с JWT токенами:
  ```typescript
  export function isExpired(token: string) {
    const payload = getPayload(token);
    if (payload) {
      const expDate = new Date(payload.exp * 1000);
      const currentDate = new Date();
      return expDate <= currentDate;
    }
    return true;
  }
  ```

- **shared/tools.ts**  
  Вспомогательные функции для работы с данными и форматирования

## Особенности организации

1. **Атомарность компонентов**: каждый компонент находится в отдельной директории с собственными стилями и логикой

2. **Страничная ориентация**: основная структура проекта организована вокруг страниц с соответствующими маршрутами

3. **Разделение ответственности**: API-запросы вынесены в отдельные модули, отделены от компонентов UI

4. **Глобальный контекст**: общее состояние приложения управляется через Context API