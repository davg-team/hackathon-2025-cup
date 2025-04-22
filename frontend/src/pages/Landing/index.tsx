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

const BlockHeader = {
  buttons: [
    {
      text: "Перейти",
      theme: "action",
      url: "/region/0",
    },
    {
      text: "Подробнее о решении",
      theme: "outlined",
      url: "#1",
    },
  ],
  description:
    "<p>Команда Davg-team представляет.</p>\n<p>Разработанно в рамках всероссийских соревнований по спортивному программированию 2025.</p>",
  title:
    "Автоматизированная информационная система «Федерация Спортивного Программирования»",
  type: "header-block",
  verticalOffset: "m",
  width: "m",
};

const BlockScenarios = {
  type: "slider-block",
  title: {
    text: "Сценарии использования",
  },
  children: [
    {
      icon: "/svg/icon_1_light.svg",
      title: "Личный кабинет представителя ФСП",
      text: "Мониторинг заявок от регионов, акцепт и предоставление обратной связи, управление календарем соревнований и аналитика данных для отчетности.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_2_light.svg",
      title: "Личный кабинет регионального представителя",
      text: "Подача и отслеживание заявок на проведение соревнований, управление профилем и данными об успехах региональных участников.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_3_light.svg",
      title: "Авторизация и безопасность",
      text: "Авторизация через различных провадеров. Платформа готова к интеграции с ЕСИА госуслуг и другими сервисами.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_1_light.svg",
      title: "Процесс подачи заявок",
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
    {
      icon: "/svg/icon_1_light.svg",
      title: "Аналитические отчеты",
      text: "Формирование и просмотр аналитических отчетов по регионам, командам, участникам.",
      type: "basic-card",
    },
  ],
};

// Преимущества системы
const BlockAdvantages = {
  type: "extended-features-block",
  colSizes: {
    all: 12,
    md: 4,
    sm: 6,
  },
  title: {
    text: "Преимущества системы",
    textSize: "m",
  },
  description: "<p>Ключевые преимущества нашей платформы.</p>",
  items: [
    {
      title: "Улучшенная координация",
      text: "<p>Сократите объем коммуникаций благодаря единой платформе для взаимодействия с регионами.</p>",
      icon: {
        dark: "/svg/icon_1_dark.svg",
        light: "/svg/icon_1_light.svg",
      },
      additionalInfo:
        '<p>Узнайте больше о <a href="#">преимуществах системы</a>.</p>',
    },
    {
      title: "Упрощение процессов",
      text: "<p>Автоматизируйте процессы подачи и обработки заявок, экономя время и ресурсы.</p>",
      icon: {
        dark: "/svg/icon_1_dark.svg",
        light: "/svg/icon_1_light.svg",
      },
      // buttons: [
      //   {
      //     text: "Подробнее",
      //     theme: "action",
      //     url: "#",
      //   },
      //   {
      //     text: "Демо-версия",
      //     theme: "outlined",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Аналитика и отчетность",
      text: "<p>Получайте аналитические данные для принятия обоснованных решений.</p>",
      icon: {
        dark: "/svg/icon_1_dark.svg",
        light: "/svg/icon_1_light.svg",
      },
      // links: [
      //   {
      //     arrow: true,
      //     text: "Перейти",
      //     theme: "normal",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Безопасность и надежность",
      text: "<p>Гарантируйте безопасность данных и конфиденциальность информации.</p>",
      icon: {
        dark: "/svg/icon_1_dark.svg",
        light: "/svg/icon_1_light.svg",
      },
    },
    // готовность к интеграции с есиа
    {
      title: "Готовность к интеграции",
      text: "<p>Платформа готова к интеграции с ЕСИА госуслуг и другими сервисами.</p>",
      icon: {
        dark: "/svg/icon_1_dark.svg",
        light: "/svg/icon_1_light.svg",
      },
    },
  ],
};

// Основные возможности
const BlockFeatures = {
  type: "card-layout-block",
  title: "Основные возможности",
  description: "Карточки с ключевыми функциями системы.",
  children: [
    {
      icon: "/svg/icon_1_light.svg",
      title: "Управление соревнованиями",
      text: "Планирование, организация и отслеживание соревнований в одном месте.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_2_light.svg",
      title: "Единый календарь",
      text: "Общий доступ к календарю соревнований с возможностью фильтрации по регионам.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_2_light.svg",
      title: "Личные кабинеты для регионов и ФСП",
      text: "Региональные представители подают заявки, загружают протоколы и управляют профилями. ФСП администрирует заявки и управляет событиями.",
      type: "basic-card",
    },
    {
      icon: "/svg/icon_2_light.svg",
      title: "Интеграция с Telegram",
      text: "Уведомления о статусах заявок и событий напрямую отправляются в мессенджер.",
      type: "basic-card",
    },
  ],
};

// Блок Функционал
const BlockFunctionality = {
  type: "slider-new-block",
  title: "Функционал",
  children: [
    {
      type: "basic-card",
      title: "Мониторинг заявок",
      text: "Следите за поданными заявками и предоставляйте обратную связь вовремя.",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K",
    },
    {
      type: "basic-card",
      title: "Управление профилями",
      text: "Обновляйте информацию региональных представительств ФСП.",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K",
    },
    {
      type: "basic-card",
      title: "Мультизагрузка данных",
      text: "Загрузка итоговых протоколов соревнований и автоматическое формирование отчетов.",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K",
    },
    {
      type: "basic-card",
      title: "Уведомления",
      text: "Получайте оповещения об изменениях и важных событиях напрямую через платформу.",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K",
    },
    // 2. Работа с календарями
    // Федеральный и региональный календари с возможностью фильтрации по событиям и регионам.
    {
      type: "basic-card",
      title: "Работа с календарями",
      text: "Федеральный и региональный календари с возможностью фильтрации по событиям и регионам.",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNiAyN0MyMi4wNzUxIDI3IDI3IDIyLjA3NTEgMjcgMTZDMjcgOS45MjQ4NyAyMi4wNzUxIDUgMTYgNUM5LjkyNDg3IDUgNSA5LjkyNDg3IDUgMTZDNSAyMi4wNzUxIDkuOTI0ODcgMjcgMTYgMjdaTTE2IDMwQzIzLjczMiAzMCAzMCAyMy43MzIgMzAgMTZDMzAgOC4yNjgwMSAyMy43MzIgMiAxNiAyQzguMjY4MDEgMiAyIDguMjY4MDEgMiAxNkMyIDIzLjczMiA4LjI2ODAxIDMwIDE2IDMwWiIgZmlsbD0iIzI2MjYyNiIvPgo8L3N2Zz4K",
    },
  ],
};

const BlockAboutSolution = {
  type: "promo-features-block",
  title: "О решении",
  description:
    "Платформа предназначена для повышения эффективности взаимодействия между центральной Федерацией и региональными представительствами, сокращения избыточных коммуникаций и оптимизации ресурсов.",
  theme: "default",
  items: [
    {
      title: "Централизованное управление",
      text: "Единая платформа для всех процессов, связанных со спортивным программированием на региональном уровне.",
      media: {
        image:
          "data:image/png;base64,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",
      },
    },
    {
      title: "Повышение эффективности",
      text: "Снижение времени на координацию и согласование действий благодаря четко налаженным процессам.",
      media: {
        image:
          "data:image/png;base64,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",
      },
    },
    {
      title: "Поддержка принятия решений",
      text: "Используйте аналитические инструменты для принятия обоснованных решений.",
      media: {
        image:
          "data:image/png;base64,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",
      },
    },
  ],
};

const BlockArchitecture = {
  type: "banner-block",
  theme: "light",
  title: "Архитектура решения",
  subtitle:
    "Платформа состоит из нескольких ключевых компонентов, которые взаимодействуют друг с другом.",
  image: {
    light:
      "https://calendar.life-course.online/docs/pages/backend/architecture_v1.png",
  },
  disableCompress: true,
  color: {
    light: "#EFF2F8",
    dark: "#262626",
  },
  button: {
    text: "Документация",
    url: "https://calendar.life-course.online/docs/pages/backend/architecture.html",
  },
  animated: true,
};

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

const BlockForm = {
  type: "form-block",
  formData: {
    yandex: {
      id: "6751d31784227cbe6664e00f",
      customFormSection: "cloud",
      theme: "default",
    },
  },
  direction: "center",
  textContent: {
    title: "Подпишитесь на обновления",
    text: "Мы сообщим вам о новых возможностях платформы.",
  },
  image: {
    src: "/img/signup.png",
  },
  backgroundColor: "#262626",
};

const BlockQA = {
  type: "questions-block",
  title: "Часто задаваемые вопросы",
  text: "Если у вас остались вопросы, вы можете найти ответы на них в нашей документации.",
  items: [
    {
      title: "Как подать заявку на проведение соревнования?",
      text: "Вы можете подать заявку через личный кабинет регионального представителя, указав все необходимые данные о событии.",
    },
    {
      title: "Как получить доступ к аналитическим отчетам?",
      text: "Аналитические отчеты доступны представителям ФСП в разделе «Аналитика».",
    },
    {
      title: "Как связаться с технической поддержкой?",
      text: "Вы можете написать на почту",
    },
    {
      title: "Какие данные сохраняются в системе?",
      text: "Система хранит заявки, отчеты, результаты соревнований, а также данные профилей пользователей.",
    },
    {
      title: "Можно ли интегрировать систему с внешними сервисами?",
      text: "Да, платформа поддерживает интеграцию с Госуслугами, Telegram и другими системами.",
    },
  ],
};

const BlockLinks = {
  type: "content-layout-block",
  textContent: {
    title: "Спасибо за внимание!",
    text: "Напоминаем вам про полезные ссылки, которые могут пригодиться.",
    buttons: [
      {
        text: "Документация",
        theme: "action",
        url: "/docs/",
      },
      {
        text: "Связаться с нами",
        theme: "outlined",
        url: "/features/team/",
      },
    ],
    links: [
      {
        url: "/features/repository/",
        text: "Репозиторий проекта",
        theme: "normal",
        arrow: true,
      },
    ],
  },
  fileContent: [
    {
      href: "/features/screencast.mp4",
      text: "Видеодемонстрация",
    },
    {
      href: "/features/promo.mp4",
      text: "Промо-ролик",
    },
    {
      href: "/features/repository.doc",
      text: "Архитектура решения",
    },
    {
      href: "/features/presentation.pdf",
      text: "Презентация решения",
    },
  ],
};

const GetPromo = () => {
  const { toggleTheme } = useContext(ThemeContext);

  // Проверяем указано ли в cookies, что пользователь уже видел промо
  const isPromoSeen = getCookie("isPromoDarkThemeSeen");

  // Если пользователь уже видел промо, не показываем его
  if (isPromoSeen) {
    return null;
  } else {
    // Устанавливаем куку, что пользователь уже видел промо
    setCookie("isPromoDarkThemeSeen", "true");
  }

  return (
    <PromoSheet
      title="Попробуйте тёмную тему"
      message="На нашем сайте доступна тёмная тема! Попробуйте её, чтобы сделать работу с платформой более комфортной в тёмное время суток."
      actionText="Попробовать"
      closeText="Нет, спасибо"
      onActionClick={toggleTheme}
    />
  );
};

const BlockShare = {
  type: "share-block",
  items: ["vk", "telegram", "linkedin"],
};

interface LandingProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

const Landing = ({ navigation, navigation_custom }: LandingProps) => {
  return (
    <PageConstructor
      custom={{
        navigation: navigation_custom,
        blocks: {
          promo: GetPromo,
        },
      }}
      content={{
        background: {
          dark: {
            color: "#282828", //282828 #121212 221d22  1b1c21
            image: "/img/Collage.png",
          },
          light: {
            color: "#EDEDED",
            image: "/img/Collage.png",
          },
        },
        blocks: [
          BlockHeader,
          BlockScenarios,
          BlockAdvantages,
          BlockFeatures,
          BlockFunctionality,
          BlockAboutSolution,
          BlockArchitecture,
          BlockTechnologies,
          BlockForm,
          BlockQA,
          BlockLinks,
          BlockShare,
          {
            type: "promo",
          },
        ],
      }}
      navigation={navigation}
    />
  );
};

export default Landing;
