/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Button,
  Col,
  Container,
  Flex,
  Icon,
  Loader,
  Modal,
  Row,
  Text,
} from "@gravity-ui/uikit";
import { useContext, useEffect, useState } from "react";
import "./index.css";
import { Context, DataType } from "app/Context";
import { isExpired } from "shared/jwt-tools";

const Xmark = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16">
      <path
        fill="currentColor"
        fill-rule="evenodd" 
        d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06
         1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75
         0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06" 
        clip-rule="evenodd"
      />
  </svg>`;

const LoginButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const { providers, setProviders } = useContext(Context);
  const token = localStorage.getItem("token");

  const subdomain = window.location.hostname.split(".")[0];
  const isSubdomain =
    subdomain !== "fsp-platform" &&
    subdomain !== "localhost" &&
    subdomain !== "fsp";
  const location_hostname = isSubdomain
    ? window.location.hostname.split(".").slice(0).join(".")
    : window.location.hostname;

  useEffect(() => {
    async function request() {
      try {
        if (providers.length === 0) {
          setIsLoading(true);
          const url = "/api/auth/providers";
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data);

          setProviders(data);
          setIsLoading(false);
          setError("");
        }
      } catch (error) {
        setIsLoading(false);
        setError(error);
        console.error("Ошибка при выполнении запроса:", error);
      }
    }
    if (open && !providers.length) {
      request();
    }
  }, [open]);

  useEffect(() => {
    if (open && !isLoading && providers.length !== 0) {
      providers.forEach((item, index) => {
        if (item.service === "yandex" && item.oauth2?.instant_authorization) {
          // @ts-ignore
          window.YaAuthSuggest.init(
            {
              client_id: item.oauth2?.authorize.params.client_id,
              response_type: item.oauth2.authorize.params.response_type,
              redirect_uri: `https://${location_hostname}/callback/auth/return/yandex`,
            },
            item.oauth2?.authorize.url,
            {
              view: "button",
              parentId: `yandex-${index}`,
              buttonSize: "m",
              buttonView: "main",
              buttonTheme: "light",
              buttonBorderRadius: "15",
              buttonIcon: "ya",
            },
          )
            // @ts-ignore
            .then(({ handler }) => handler())
            // @ts-ignore
            .then((data) => console.log("Сообщение с токеном", data))
            // @ts-ignore
            .catch((error) => console.log("Обработка ошибки", error));
        }
      });
    }
  }, [open, providers, isLoading]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Container className="modal-container">
          <Row space="0">
            <Col s={9}>
              <Text variant="display-1">Войдите в аккаунт</Text>
            </Col>
            <Col s={3} style={{ display: "flex", justifyContent: "end" }}>
              <Button
                view="action"
                className="close-button"
                onClick={() => setOpen((prev) => !prev)}
              >
                <Icon data={Xmark} />
              </Button>
            </Col>
            <br />
            <br />
            <br />
          </Row>
          <Flex direction="column">
            {providers.length && !isLoading ? (
              providers.map((item: DataType, index) => {
                if (
                  item.service === "yandex" &&
                  item.slug === "yandex" &&
                  item.oauth2?.instant_authorization === true
                ) {
                  return (
                    <Row space="0" key={`item-${item.slug}-${index}`}>
                      <Col className="col-margin">
                        <div
                          className="g-link g-link_view_normal"
                          id={`yandex-${index}`}
                        ></div>
                      </Col>
                    </Row>
                  );
                } else if (item.slug === "rsaag" || item.slug === "esia") {
                  return (
                    <Row space="0" key={`item-${item.slug}-${index}`}>
                      <Col className="col-margin">
                        <a
                          className="g-link g-link_view_normal"
                          href={`${item.oauth2?.authorize.url}?response_type=code&client_id=${item.oauth2?.authorize.params.client_id}&scope=email`}
                        >
                          <div className="popup__item">
                            <img src={item.icon} className="logo" />
                            <div className="text">
                              Войти через <b>{item.name}</b>
                            </div>
                          </div>
                        </a>
                      </Col>
                    </Row>
                  );
                } else if (item.oauth2?.instant_authorization === false) {
                  return (
                    <Row space="0" key={`item-${item.slug}-${index}`}>
                      <Col className="col-margin">
                        <a
                          className="g-link g-link_view_normal"
                          href={`${item.oauth2?.authorize.url}?response_type=code&client_id=${item.oauth2?.authorize.params.client_id}&redirect_uri=https://${location_hostname}/callback/auth/return/${item.slug}`}
                        >
                          <div className="popup__item">
                            <img src={item.icon} className="logo" />
                            <div className="text">
                              Войти через <b>{item.name}</b>
                            </div>
                          </div>
                        </a>
                      </Col>
                    </Row>
                  );
                } else if (item.service === "telegram") {
                  return (
                    <Row space="0" key={`item-${item.slug}-${index}`}>
                      <Col className="col-margin">
                        <a
                          className="g-link g-link_view_normal"
                          href={`https://oauth.telegram.org/auth?bot_id=${item.other_data.bot_id}&origin=https://${location_hostname}/callback/auth/return/tg&embed=0&request_access=write&redirect_uri=https://${location_hostname}/callback/auth/return/telegram`}
                        >
                          <div className="popup__item">
                            <img src={item.icon} className="logo" />
                            <div className="text">
                              Войти через <b>{item.name}</b>
                            </div>
                          </div>
                        </a>
                      </Col>
                    </Row>
                  );
                }
              })
            ) : (
              <>
                {error ? (
                  <>
                    При загрузке вариантов входа произошла ошибка, попробуйте
                    повторить вход позже
                  </>
                ) : (
                  <Row space="0">
                    <Col>
                      <div className="spinner">
                        <Loader />
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {!isLoading && !error && (
              <Text variant="body-2">
                Продолжая регистрацию вы соглашаетсь с{" "}
                <a
                  className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
                  href="/policy"
                >
                  политикой конфиденциальности
                </a>
              </Text>
            )}
          </Flex>
        </Container>
      </Modal>
      {!token || isExpired(token) ? (
        <Button
          view="action"
          size="l"
          onClick={() => {
            setOpen((prev: boolean) => !prev);
          }}
        >
          Войти
        </Button>
      ) : null}
    </>
  );
};

export default LoginButton;
