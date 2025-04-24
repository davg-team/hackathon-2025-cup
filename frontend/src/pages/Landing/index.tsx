/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PromoSheet } from "@gravity-ui/components";
import {
  CustomItems,
  NavigationData,
  PageConstructor,
} from "@gravity-ui/page-constructor";
import { ThemeContext } from "app/index";
import { useContext } from "react";
import { getCookie, setCookie } from "shared/tools";


const ic = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K"


//
// 1. Заголовок
//
const BlockHeader = {
  type: "header-block",
  verticalOffset: "m",
  width: "m",
  title:
    "Автоматизированная информационная система «Федерация Спортивного Программирования»",
  description:
    "<p>Полностью микросервисная платформа для управления соревнованиями, заявками и аналитикой ФСП и её регионов.</p>\n\n<p>Команда Davg-team.</p>\n<p>Разработанно в рамках кубка России по спортивному программированию 2025.</p>",
  buttons: [
    { text: "Перейти к событиям", theme: "action", url: "/events" },
    { text: "Документация", theme: "outlined", url: "/docs/" },
  ],
};

// и прошедших соревнованиях, а также о зарегистрированных спортсменах,
// используя фильтры по дисциплине, региону, дате и статусу. Имеется
// возможность выгрузки данных в отдельном файле для работы.

const BlockScenarios = {
  type: "slider-block",
  title: { text: "Основные сценарии использования" },
  children: [
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "ЛК ФСП",
      text: "Создавайте федеральные соревнования, принимайте заявки от регионов, управляйте информацией о федерации и смотрите глобальную аналитику.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "ЛК регионального представителя",
      text: "Подавайте заявки на проведение региональных соревнований, модерайте командные заявки и загружайте протоколы.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "ЛК капитана команды",
      text: "Формируйте состав команды, отправляйте заявки на соревнования, приглашайте участников и отслеживайте статус.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Аналитика и отчёты",
      text: "Генерируйте дашборды по заявкам, участникам и результатам, экспортируйте CSV/XLSX.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Создание открытого соревнования",
      text: "Создавайте открытые соревнования с обязательными атрибутами, публикуйте их и управляйте активными событиями.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Регистрация команды в полном составе",
      text: "Находите соревнования, создавайте команды, приглашайте участников и отправляйте заявки на модерацию.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Регистрация команды с частичным составом",
      text: "Создавайте команды с открытыми местами, указывайте роли и находите участников через систему.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Присоединение к команде",
      text: "Просматривайте списки команд, отправляйте запросы капитанам и присоединяйтесь к утверждённым составам.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Создание федерального соревнования",
      text: "Создавайте федеральные соревнования, принимайте заявки от регионов и утверждайте их для участия.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Регистрация на региональное соревнование",
      text: "Создавайте региональные и межрегиональные соревнования с автоматической проверкой заявок.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Индивидуальная регистрация",
      text: "Подавайте индивидуальные заявки на соревнования с заполнением необходимых данных.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Подведение итогов и обновление портфолио",
      text: "Вносите результаты соревнований, обновляйте профили спортсменов и публикуйте итоги.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Личный профиль",
      text: "Редактируйте данные профиля, просматривайте историю участия и подтверждайте участие в командах.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Аналитика достижений",
      text: "Анализируйте данные о соревнованиях и спортсменах, используйте фильтры и экспортируйте данные.",
    },
  ],
};

const BlockDopScenarios = {
  type: "slider-block",
  title: {
    text: "Дополнительные сценарии использования",
  },
  children: [
    {
      icon: "/svg/icon_3_light.svg",
      title: "Авторизация и безопасность",
      text: "Авторизация через различных провадеров по OAuth. Платформа готова к интеграции с ЕСИА госуслуг и другими сервисами. Уже сейчас поддерживается авторизация через госуслуги, Яндекс и Telegram.",
      type: "basic-card",
    },
    {
      icon: ic,
      title: "Процесс подачи заявок на проведение соревнований",
      text: "Отправка заявок на проведение соревнований с возможностью внесения в ЕКП и рассмотрения заявок центральным ФСП.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_1_light.svg",
      title: "Публикация в календаре",
      text: "Публикация одобренных соревнований в общедоступном календаре с фильтрацией по регионам.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_1_light.svg",
      title: "Мультизагрузчик результатов",
      text: "Унификация загрузки данных итоговых протоколов через мультизагрузчик результатов соревнований.",
      type: "basic-card",
    },
  ],
};

//
// 3. Преимущества системы
//
const BlockAdvantages = {
  type: "extended-features-block",
  title: { text: "Преимущества системы", textSize: "m" },
  description: "<p>Почему платформа решает задачи ФСП и регионов</p>",
  colSizes: { all: 12, md: 4, sm: 6 },
  items: [
    {
      title: "Историческая неизменность заявок",
      text: "<p>Состав команды и название фиксируются в заявке и сохраняются в истории заявок, даже если команда меняется позже.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
    {
      title: "Гибкая модерация",
      text: "<p>Региональные и федеральные модераторы видят только свои заявки и могут оперативно принимать решения.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
    {
      title: "Масштабируемая аналитика",
      text: "<p>Сквозная агрегация из events, applications-service, reports для построения дашбордов.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
    {
      title: "Уведомления в реальном времени",
      text: "<p>Email и Telegram-оповещения по ключевым событиям: приглашения, статус заявок, результаты.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
    {
      title: "Авто-партиционирование YDB",
      text: "<p>Высокая производительность и отказоустойчивость базы данных без ручных настроек.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
    {
      title: "Готовность к интеграции",
      text: "<p>OAuth2/JWT, поддержка ЕСИА, готовый API для сторонних систем и Telegram-бота.</p>",
      icon: { light: "/svg/icon_2_light.svg", dark: "/svg/icon_2_light.svg" },
    },
  ],
};

//
// 4. Основные возможности
//
const BlockFeatures = {
  type: "card-layout-block",
  title: "Основные возможности",
  description: "Ключевые функции платформы",
  children: [
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Управление событиями",
      text: "Полный lifecycle: создание, публикация, модерация, архивирование.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Заявки и модерация",
      text: "Индивидуальные и командные заявки с авто-проверкой регионов и дедлайнов.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Команды",
      text: "Создавайте временные и постоянные команды, приглашайте участников, фиксируйте состав.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Протоколы и результаты",
      text: "Мультизагрузчик итоговых протоколов, автоматическое обновление портфолио.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Аналитика",
      text: "Дашборды по событиям, заявкам и результатам, экспорт в CSV/XLSX.",
    },
    {
      type: "basic-card",
      icon: "/svg/icon_2_light.svg",
      title: "Файловый сервис",
      text: "Хранение аватаров, протоколов, изображений и любых других артефактов.",
    },
  ],
};

//
// 5. Функционал (слайдер)
//
// const BlockFunctionality = {
//   type: "slider-new-block",
//   title: "Гибкий функционал",
//   children: [
//     {
//       type: "basic-card",
//       title: "Рейтинг и лидерборды",
//       text: "Автоматически считаемые рейтинги участников и команд по дисциплинам.",
//       icon: "/svg/func_rating.svg",
//     },
//     {
//       type: "basic-card",
//       title: "Геймификация",
//       text: "Бейджи и достижения за активность, победы и количество соревнований.",
//       icon: "/svg/func_gamification.svg",
//     },
//     {
//       type: "basic-card",
//       title: "Рекомендательный движок",
//       text: "Подбор соревнований по профилю спортсмена на основе истории участия.",
//       icon: "/svg/func_recommendation.svg",
//     },
//     {
//       type: "basic-card",
//       title: "API для внешних систем",
//       text: "Публикуйте события на сторонних порталах, импортируйте результаты.",
//       icon: "/svg/func_api.svg",
//     },
//   ],
// };

//
// 6. О решении
//
const BlockAboutSolution = {
  type: "promo-features-block",
  title: "О решении",
  description:
    "Платформа автоматизирует весь цикл соревнований: от подачи заявки до аналитики.",
  theme: "default",
  items: [
    {
      title: "Доменные микросервисы",
      text: "Изолированные сервисы для пользователей, событий, заявок, команд, результатов и аналитики.",
      media: { image: "/img/architecture_microservices.png" },
    },
    {
      title: "YDB в основе",
      text: "Распределённое хранилище с авто-партиционированием и консистентностью.",
      media: { image: "/img/architecture_ydb.png" },
    },
    {
      title: "REST API + JWT",
      text: "Безопасная маршрутизация через API Gateway, OAuth2 и JSON Web Tokens.",
      media: { image: "/img/architecture_api.png" },
    },
  ],
};

//
// 7. Технологии
//
const BlockTechnologies = {
  type: "icons-block",
  items: [
    {
      src: "https://img.icons8.com/color/96/000000/python.png",
      text: "FastAPI",
    },
    {
      src: "https://img.icons8.com/color/96/000000/react-native.png",
      text: "React",
    },
    {
      src: "https://img.icons8.com/color/96/000000/golang.png",
      text: "Go",
    },
    {
      src: "/img/ydb.jpg",
      text: "YDB",
    },
    {
      src: "https://storage.yandexcloud.net/cloud-www-assets/region-assets/ru/favicon/favicon-76x76.png",
      text: "Yandex.Cloud (152-ФЗ РФ)",
    },
  ],
  size: "s",
};

//
// 8. Архитектура
//
const BlockArchitecture = {
  type: "banner-block",
  theme: "light",
  title: "Архитектура решения",
  subtitle: "Микросервисы и их взаимодействие",
  image: {
    light: "/img/architecture_diagram.svg",
    dark: "/img/architecture_diagram_dark.svg",
  },
  button: { text: "Подробнее в документации", url: "https://fsp-platform.ru/docs/pages/architecture.html" },
};

//
// 9. Форма подписки
//
const BlockForm = {
  type: "form-block",
  direction: "center",
  textContent: {
    title: "Подпишитесь на обновления",
    text: "Будьте в курсе новых функций и релизов платформы.",  },
  formData: {
    yandex: { id: "6751d31784227cbe6664e00f", customFormSection: "cloud" },
  },
  image: { src: "/img/signup.png" },
};

//
// 10. FAQ
//
const BlockQA = {
  type: "questions-block",
  title: "Часто задаваемые вопросы",
  items: [
    {
      title: "Как подать командную заявку?",
      text: "Выберите событие, пригласите участников и отправьте заявку.",
    },
    {
      title: "Как модератору утвердить заявку?",
      text: "Перейдите в раздел «Заявки» в ЛК регионального представителя или ФСП и утвердите заявку.",
    },
    {
      title: "Как скачать протокол соревнования?",
      text: "В карточке события нажмите «Скачать протокол»",
    },
    {
      title: "Как получить доступ к API?",
      text: "В разделе «Документация» доступен OpenAPI-спецификатор и примеры запросов.",
    },
  ],
};

//
// 11. Ссылки
//
const BlockLinks = {
  type: "content-layout-block",
  textContent: {
    title: "Полезные ссылки",
    text: "Перейдите в документацию или свяжитесь с командой проекта.",
    links: [
      { text: "Документация", url: "https://fsp-platform.ru/docs", theme: "normal", arrow: true },
      { text: "Репозиторий", url: "https://github.com/hackathonsrus/PP_davg_66", theme: "normal", arrow: true },
      // { text: "Команда проекта", url: "/features/team", theme: "normal", arrow: true },
    ],
  },
  fileContent: [
    { href: "/features/presentation.pdf", text: "Презентация" },
    // { href: "/features/er-diagram.puml", text: "ER-диаграмма" },
  ],
};

//
// PromoSheet
//
const GetPromo = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const seen = getCookie("promoSeen");
  if (seen) return null;
  setCookie("promoSeen", "true");
  return (
    <PromoSheet
      title="Попробуйте тёмную тему"
      message="Удобно работать в любое время суток — переключитесь на тёмную тему."
      actionText="Включить"
      closeText="Позже"
      onActionClick={toggleTheme}
    />
  );
};

//
// 12. Социальный шаринг
//
const BlockShare = {
  type: "share-block",
  items: ["telegram", "vk", "linkedin"],
};

//
// Собираем страницу
//
interface LandingProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

const Landing = ({ navigation, navigation_custom }: LandingProps) => (
  <PageConstructor
    custom={{ navigation: navigation_custom, blocks: { promo: GetPromo } }}
    content={{
      background: {
        light: { color: "#EDEDED", image: "/img/Collage.png" },
        dark: { color: "#282828", image: "/img/Collage.png" },
      },
      blocks: [
        BlockHeader,
        BlockScenarios,
        BlockDopScenarios,
        BlockAdvantages,
        BlockFeatures,
        // BlockFunctionality,
        BlockAboutSolution,
        BlockTechnologies,
        BlockArchitecture,
        BlockForm,
        BlockQA,
        BlockLinks,
        BlockShare,
      ],
    }}
    navigation={navigation}
  />
);

export default Landing;
