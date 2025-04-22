/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link } from "react-router-dom";
import LoginButton from "features/components/LoginButton";
import { Button, Icon } from "@gravity-ui/uikit";
import { Moon, Sun } from "@gravity-ui/icons";
import {
  CustomItems,
  NavigationData,
  NavigationDropdownItem,
  NavigationItemType,
} from "@gravity-ui/page-constructor";
import InsideAPopup from "../NitificationsInsidePopup";
import { getPayload, isExpired, JWTPayload } from "shared/jwt-tools";
import { useContext } from "react";
import { Context } from "app/Context";
import User from "../User";

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
      to="/region/0"
    >
      Федерация
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

const Calendar = () => {
  return (
    <Link
      className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
      to="/calendar"
    >
      Календарь
    </Link>
  );
};

const FSPRegion = () => {
  const token = localStorage.getItem("token");
  const payload: JWTPayload | null =
    token && !isExpired(token) ? getPayload(token) : null;
  const { isLoggined } = useContext(Context);

  return (
    <>
      {(payload?.region_id === "0" || payload?.region_id === null) &&
      isLoggined ? null : payload?.region_id ? (
        <Link
          className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
          to={`/region/${payload.region_id}`}
        >
          ФСП: {payload.region_id}
        </Link>
      ) : null}
    </>
  );
};

const HeaderHelpLinks: NavigationDropdownItem = {
  items: [
    {
      text: "Репозиторий",
      type: NavigationItemType.Link,
      url: "/features/repository/",
    },
    {
      text: "Документация",
      type: NavigationItemType.Link,
      url: "/docs/",
    },
    {
      text: "Скринкаст",
      type: NavigationItemType.Link,
      url: "/features/screencast/",
    },
    {
      text: "Презентация",
      type: NavigationItemType.Link,
      url: "/features/presentation/",
    },
    {
      text: "Команда",
      type: NavigationItemType.Link,
      url: "/features/team/",
    },
  ],
  text: "О нас",
  hidePopup: () => false,
  isActive: false,
  type: NavigationItemType.Dropdown,
};

function useProps(theme: string, setTheme: () => void): NavigationData {
  const token = localStorage.getItem("token");
  const { isLoggined } = useContext(Context);

  console.log("token expired:", isExpired(token as string));
  console.log("payload:", getPayload(token as string));
  console.log("isLoggined:", isLoggined);

  return {
    header: {
      leftItems: [
        {
          //@ts-ignore
          type: "general",
        },
        {
          //@ts-ignore
          type: "regional",
        },
        {
          //@ts-ignore
          type: "calendar",
        },
      ],
      //@ts-ignore
      rightItems:
        (!token || isExpired(token)) && !isLoggined // Не залогинен
          ? [
              HeaderHelpLinks,
              { type: "custom-item" },
              {
                type: "theme-switcher",
                theme: theme,
                setTheme: setTheme,
              },
            ]
          : // Залогинен
            [
              HeaderHelpLinks,
              { type: "fsp-regional" },
              { type: "custom-item" },
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
    "custom-item": LoginButton,
    notify: InsideAPopup,
    "theme-switcher": ThemeButton,
    "fsp-regional": FSPRegion,
    user: User,
    calendar: Calendar,
  };
}

export { getNavigationCustoms, useProps };
