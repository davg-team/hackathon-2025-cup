import {
  Button,
  Col,
  Container,
  Flex,
  Loader,
  Row,
  Select,
  Text,
  TextInput,
  useToaster,
} from "@gravity-ui/uikit";
import { useContext, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getPayload, isTemproary, setToken } from "shared/jwt-tools";
import { data } from "shared/data";
import { Context } from "app/Context";

interface FormData {
  email: string;
  first_name: string;
  last_name: string;
  second_name: string;
  role_request: string;
  region_id: string;
}

const LoginCallback = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<FormData>({
    email: "",
    first_name: "",
    last_name: "",
    second_name: "",
    role_request: "",
    region_id: "",
  });
  const { setIsLoggined } = useContext(Context);
  const navigate = useNavigate();
  const toaster = useToaster();

  async function register(state: FormData) {
    const url = "/api/auth/account/register";
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: JSON.stringify({
        ...state,
        region_id: state.role_request === "fsp_staff" ? "0" : state.region_id,
      }),
    });

    if (response.ok) {
      localStorage.setItem("isLoggined", "true");
      setIsLoggined(true);
      navigate("/after-register");
      toaster.add({
        theme: "success",
        autoHiding: 5000,
        name: "success",
        title: "Регистрация прошла успешно",
      });
    } else {
      toaster.add({
        theme: "danger",
        autoHiding: 5000,
        name: "error",
        title: "Произошла ошибка при регистрации",
      });
    }
  }

  useEffect(() => {
    async function request() {
      try {
        setLoading(true);
        const service = params.provider;
        let code;
        let response;
        if (service == "tg") {
          code = location.hash.split("=")[1];

          response = await fetch(
            `/api/auth/providers/tg/authorize/tgAuthResult`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                tgAuthResult: code,
              }),
            },
          );
        } else {
          code = searchParams.get("code");

          response = await fetch(
            `/api/auth/providers/${service}/authorize/oauth_code`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                code: code,
                redirect_uri: `${location.origin}${location.pathname}`,
              }),
            },
          );
        }

        const data = await response.json();
        console.log(getPayload(data.access_token));

        if (isTemproary(data.access_token)) {
          localStorage.setItem("temp_token", data.access_token);
          setLoading(true);

          response = await fetch("/api/auth/account/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          const d = await response.json();

          localStorage.setItem("token", d.access_token);

          setLoading(false);
          setIsLoggined(true);
        } else {
          setIsLoggined(true);
          setToken(data.access_token);
          setLoading(false);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErr(true);
        setLoading(false);
      }
    }

    request();
  }, [location]);

  if (err) {
    return (
      <Container>
        <Row space={0}>
          <Col></Col>
          <Col>
            <br />
            <br />
            <Text variant="display-1">При авторизации произошла ошибка</Text>
            <p>
              Вернитесь{" "}
              <Link className="" to={"/"}>
                назад
              </Link>{" "}
              и попробуйте позже
            </p>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
  if (loading) {
    return (
      <Container>
        <Flex direction="column" alignItems={"center"}>
          <Col></Col>
          <Col>
            <br />
            <br />
            <Flex direction="column" alignItems={"center"}>
              <Text variant="display-1">Авторизация</Text>
              <div>
                <Loader />
              </div>
            </Flex>
          </Col>
          <Col></Col>
        </Flex>
      </Container>
    );
  }
  if (!loading && !err) {
    return (
      <Container>
        <br />
        <br />
        <Row space={0}>
          <Col></Col>
          <Col s={10}>
            <Flex direction="column" gap="1">
              <Text variant="display-1" style={{ textAlign: "center" }}>
                Завершение регистрации
              </Text>
              <TextInput
                label="Email"
                value={state?.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setState((prev) => {
                    return { ...prev, email: event.target.value };
                  });
                }}
              />
              <TextInput
                label="Имя"
                value={state?.first_name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setState((prev) => {
                    return { ...prev, first_name: event.target.value };
                  });
                }}
              />
              <TextInput
                label="Фамилия"
                value={state?.last_name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setState((prev) => {
                    return { ...prev, last_name: event.target.value };
                  });
                }}
              />
              <TextInput
                label="Отчество"
                value={state?.second_name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setState((prev) => {
                    return { ...prev, second_name: event.target.value };
                  });
                }}
              />
              <Select
                label="Роль"
                onUpdate={(value) => {
                  setState((prev) => {
                    return { ...prev, role_request: value[0] };
                  });
                }}
                options={[
                  {
                    content: "Представитель ФСП",
                    value: "fsp_staff",
                  },
                  {
                    content: "Представитель регионального отделения ФСП",
                    value: "fsp_region_staff",
                  },
                  {
                    content: "Руководитель регионального отделения ФСП",
                    value: "fsp_region_head",
                  },
                ]}
              />
              {state.role_request !== "fsp_staff" && (
                <Select
                  label="Регион"
                  onUpdate={(value) => {
                    setState((prev) => {
                      return { ...prev, region_id: value[0] };
                    });
                  }}
                  options={data}
                />
              )}
              <Button
                onClick={() => {
                  if (
                    !state.email ||
                    !state.first_name ||
                    !state.last_name ||
                    !state.second_name ||
                    !state.role_request ||
                    (state.role_request !== "fsp_staff" && !state.region_id)
                  ) {
                    toaster.add({
                      theme: "danger",
                      autoHiding: 5000,
                      name: "error",
                      title: "Пожалуйста, заполните все поля",
                    });
                  } else {
                    register(state);
                  }
                }}
              >
                Завершить регистрацию
              </Button>
            </Flex>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
};

export default LoginCallback;
