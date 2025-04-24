/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  useState,
  useEffect,
  createContext,
  useLayoutEffect,
  useContext,
} from "react";
import AppContextProvider, { Context } from "app/Context";
import Router from "app/Router";
import {
  Container,
  Flex,
  Loader,
  ThemeProvider,
  Toaster,
  ToasterComponent,
  ToasterProvider,
} from "@gravity-ui/uikit";
import "app/styles/index.css";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import "app/styles/styles.css";
import { PageConstructorProvider, Theme } from "@gravity-ui/page-constructor";
import { ErrorBoundary } from "react-error-boundary";
import { getPayload, isExpired, deleteToken, setToken } from "shared/jwt-tools";
import { getCookie } from "shared/tools";
import { updateToken } from "api/auth";

// Создаем контекст темы
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  // @ts-ignore
  const { setIsLoggined, isLoggined } = useContext(Context);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const toaster = new Toaster();

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("can't get theme from localstorage", error);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("can't save them in localstorage", error);
    }
  };

  useLayoutEffect(() => {
    const tokenFromCookie = getCookie("token");
    const tokenFromLocalStorage = localStorage.getItem("token");
    let token = null;
    console.log(tokenFromCookie, tokenFromLocalStorage);

    if (!tokenFromCookie && !tokenFromLocalStorage) {
      setIsLoggined(false);
      setIsAuthChecked(true);
      return;
    }

    if (tokenFromCookie && tokenFromLocalStorage) {
      const tokenFromCookiePayload = getPayload(tokenFromCookie);
      const tokenFromLocalStoragePayload = getPayload(tokenFromLocalStorage);

      // if (!tokenFromCookiePayload || !tokenFromLocalStoragePayload) {
      //   deleteToken();
      //   setIsAuthChecked(true);
      //   return;
      // }

      // @ts-ignore
      if (tokenFromCookiePayload.iat > tokenFromLocalStoragePayload.iat) {
        token = tokenFromCookie;
      } else {
        token = tokenFromLocalStorage;
      }
    } else if (tokenFromCookie) {
      token = tokenFromCookie;
    } else if (tokenFromLocalStorage) {
      token = tokenFromLocalStorage;
    } else {
      deleteToken();
      setIsAuthChecked(true);
      return;
    }

    if (token) {
      try {
        if (isExpired(token)) {
          deleteToken();
          setIsAuthChecked(true);
          return;
        }
        setToken(token);
      } catch {
        console.log("can't set token");
        deleteToken();
        setIsAuthChecked(true);
        return;
      }
    }

    updateToken(token).then((res) => {
      if (res) {
        console.log(res, 1234, token);
        // setIsLoggined(true);
        setIsAuthChecked(true);
      } else {
        setIsLoggined(false);
        setIsAuthChecked(true);
      }
    });
  }, []);

  return (
    <>
      {isAuthChecked ? (
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div role="alert">
              <p>Произошла ошибка:</p>
              <pre style={{ color: "red" }}>{error.message}</pre>
            </div>
          )}
        >
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme}>
              <PageConstructorProvider
                theme={theme === "light" ? Theme.Light : Theme.Dark}
              >
                <ToasterProvider toaster={toaster}>
                  <AppContextProvider>
                    <ToasterComponent />
                    <Router theme={theme} setTheme={toggleTheme} />
                  </AppContextProvider>
                </ToasterProvider>
              </PageConstructorProvider>
            </ThemeProvider>
          </ThemeContext.Provider>
        </ErrorBoundary>
      ) : (
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div role="alert">
              <p>Произошла ошибка:</p>
              <pre style={{ color: "red" }}>{error.message}</pre>
            </div>
          )}
        >
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme}>
              <AppContextProvider>
                <Container style={{ height: "100vh" }}>
                  <Flex
                    alignItems={"center"}
                    height={"100%"}
                    justifyContent={"center"}
                  >
                    <Loader size="l" />
                  </Flex>
                </Container>
              </AppContextProvider>
            </ThemeProvider>
          </ThemeContext.Provider>
        </ErrorBoundary>
      )}
    </>
  );
};

export default App;
