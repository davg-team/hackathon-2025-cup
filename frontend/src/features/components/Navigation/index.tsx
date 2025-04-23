/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link } from "react-router-dom";
import LoginButton from "features/components/LoginButton";
import { Button, Icon } from "@gravity-ui/uikit";
import { Moon, Sun } from "@gravity-ui/icons";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import InsideAPopup from "../NitificationsInsidePopup";
import { getPayload, isExpired } from "shared/jwt-tools";
import { useContext } from "react";
import { Context } from "app/Context";
import User from "../User";
import { getRoleFromToken } from "shared/tools";

const ThemeButton = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  return (
    <Button
      size="l"
      className="pc-navigation-button pc-navigation-item__content pc-navigation-item__content_type_button"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        try {
          localStorage.setItem("theme", newTheme);
        } catch (error) {
          console.error("Ошибка при сохранении темы в localStorage:", error);
        }
      }}
    >
      <Icon data={theme === "light" ? Moon : Sun} />
    </Button>
  );
};

const General = () => {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/"
    >
      Главная
    </Link>
  );
};

const Regional = () => {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/regions"
    >
      Регионы
    </Link>
  );
};

function Competitions() {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/competitions"
    >
      Соревнования
    </Link>
  );
}

function FAQ() {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/faq"
    >
      FAQ
    </Link>
  );
}

function Profile() {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/lk"
    >
      Мой профиль
    </Link>
  );
}

function MyCompetitions() {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/lk/competitions"
    >
      Мои соревнования
    </Link>
  );
}

function Federation() {
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to={`/region/${payload?.region_id}`}
    >
      Моя федерация
    </Link>
  );
}

function Applications() {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/applications"
    >
      Заявки
    </Link>
  );
}

// const FSPRegion = () => {
//   const token = localStorage.getItem("token");
//   const payload: JWTPayload | null =
//     token && !isExpired(token) ? getPayload(token) : null;
//   const { isLoggined } = useContext(Context);
//
//   return (
//     <>
//       {(payload?.region_id === "0" || payload?.region_id === null) &&
//       isLoggined ? null : payload?.region_id ? (
//         <Link
//           className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
//           to={`/region/${payload.region_id}`}
//         >
//           ФСП: {payload.region_id}
//         </Link>
//       ) : null}
//     </>
//   );
// };

// const HeaderHelpLinks: NavigationDropdownItem = {
//   items: [
//     {
//       text: "Репозиторий",
//       type: NavigationItemType.Link,
//       url: "/features/repository/",
//     },
//     {
//       text: "Документация",
//       type: NavigationItemType.Link,
//       url: "/docs/",
//     },
//     {
//       text: "Скринкаст",
//       type: NavigationItemType.Link,
//       url: "/features/screencast/",
//     },
//     {
//       text: "Презентация",
//       type: NavigationItemType.Link,
//       url: "/features/presentation/",
//     },
//     {
//       text: "Команда",
//       type: NavigationItemType.Link,
//       url: "/features/team/",
//     },
//   ],
//   text: "О нас",
//   hidePopup: () => false,
//   isActive: false,
//   type: NavigationItemType.Dropdown,
// };

function useProps(theme: string, setTheme: () => void): NavigationData {
  const token = localStorage.getItem("token");
  const roles = getRoleFromToken();
  const { isLoggined } = useContext(Context);

  console.log(isLoggined);

  return {
    header: {
      leftItems: [
        {
          //@ts-ignore
          type: "general",
        },
        {
          //@ts-ignore
          type: "competitions",
        },
        {
          //@ts-ignore
          type: "regional",
        },
        {
          //@ts-ignore
          type: "faq",
        },
      ],
      //@ts-ignore
      rightItems:
        (!token || isExpired(token)) && !isLoggined // Не залогинен
          ? [
              { type: "login-button" },
              {
                type: "theme-switcher",
                theme: theme,
                setTheme: setTheme,
              },
            ]
          : // Залогинен
            [
              ...(roles?.includes("fsp_staff") ||
              roles?.includes("fsp_region_head") ||
              roles?.includes("fsp_region_staff") ||
              roles?.includes("root")
                ? [{ type: "my-federation" }, { type: "applications" }]
                : roles?.includes("sportsman")
                  ? [{ type: "my-competitions" }, { type: "my-profile" }]
                  : []),
              { type: "notify" },
              {
                type: "theme-switcher",
                theme: theme,
                setTheme: setTheme,
              },
              { type: "user" },
            ],
    },
    logo: {
      dark: {
        icon: "/svg/logo_01.svg",
        text: "",
      },
      icon: "/svg/fsp_full_ru-black.svg",
      light: {
        text: "",
        icon: "",
      },
      text: "",
      urlTitle: "Home page",
    },
  };
}

function getNavigationCustoms(): CustomItems {
  return {
    general: General,
    regional: Regional,
    "login-button": LoginButton,
    notify: InsideAPopup,
    "theme-switcher": ThemeButton,
    user: User,
    faq: FAQ,
    competitions: Competitions,
    "my-profile": Profile,
    "my-competitions": MyCompetitions,
    "my-federation": Federation,
    applications: Applications,
  };
}

export { getNavigationCustoms, useProps };
