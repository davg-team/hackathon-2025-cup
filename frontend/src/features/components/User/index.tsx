/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Button,
  Checkbox,
  Flex,
  Icon,
  Modal,
  Text,
  TextInput,
  UserLabel,
  useToaster,
} from "@gravity-ui/uikit";
import { Context } from "app/Context";
import { useContext, useEffect, useRef, useState } from "react";
import { getPayload } from "shared/jwt-tools";

type PayloadType = {
  sub?: string;
  first_name?: string;
  last_name?: string;
  second_name?: string;
  avatar?: string;
  email?: string;
  region_id?: string;
  snils?: string;
  notification_ways?: string[];
  phone?: string;
  tg_id?: string;
};

const User = () => {
  const token = localStorage.getItem("token");
  const { add } = useToaster();
  const payload: PayloadType | null = token ? getPayload(token) : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState({
    id: payload?.sub || "",
    first_name: payload?.first_name || "",
    last_name: payload?.last_name || "",
    second_name: payload?.second_name || "",
    avatar: payload?.avatar || "",
    email: payload?.email || "",
    snils: payload?.snils || "",
    notification_ways: payload?.notification_ways || [],
    phone: payload?.phone || "",
    tg_id: payload?.tg_id || "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const { isLoggined, isSnow, setIsSnow } = useContext(Context);
  const snowInstance = useRef(null);

  const toggleSnow = (enable: boolean) => {
    if (enable) {
      // @ts-ignore
      snowInstance.current = new Snow();
    } else {
      if (snowInstance.current) {
        const snowflakesBox = document.querySelectorAll(".snowflakes-box");
        const snowballBox = document.querySelectorAll(".snowball-box");

        snowflakesBox.forEach((item) => item.remove());
        snowballBox.forEach((item) => item.remove());

        snowInstance.current = null;
      }
    }
  };

  useEffect(() => {
    toggleSnow(isSnow);
  }, [isSnow]);

  useEffect(() => {
    return () => {
      // Удаляем снег при размонтировании компонента
      toggleSnow(false);
    };
  }, []);

  async function save() {
    setLoading(true);
    const url = "/api/auth/account/update";
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(state),
    });

    if (response.ok) {
      setLoading(false);
      add({
        name: "success",
        theme: "success",
        title: "Данные успешно обновлены",
      });
    } else {
      setLoading(false);
      add({
        name: "error",
        theme: "danger",
        title: "Произошла ошибка при обновлении данных",
      });
    }
  }

  if (isLoggined) {
    return (
      <>
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <UserLabel
            size="l"
            text={payload?.first_name + " " + payload?.last_name}
            avatar={payload?.avatar}
            onClick={() => {
              setOpen(true);
            }}
          />
        </Flex>
        <Modal open={open}>
          <Flex direction="column" spacing={{ p: 3 }}>
            <Flex justifyContent="center" alignItems="center" gap="3">
              <Text variant="display-2">Профиль пользователя</Text>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Icon
                  data={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg>'
                  }
                />
              </Button>
            </Flex>
            <Flex direction="column" gap="1">
              <TextInput
                label="Имя:"
                value={state.first_name}
                onChange={(e) => {
                  setState({ ...state, first_name: e.target.value });
                }}
              />
              <TextInput
                label="Фамилия:"
                value={state.last_name}
                onChange={(e) => {
                  setState({ ...state, last_name: e.target.value });
                }}
              />
              <TextInput
                label="Отчество:"
                value={state.second_name}
                onChange={(e) => {
                  setState({ ...state, second_name: e.target.value });
                }}
              />
              <TextInput
                label="Телефон:"
                type="tel"
                value={state.phone}
                onChange={(e) => {
                  setState({ ...state, phone: e.target.value });
                }}
              />
              <TextInput
                label="Email:"
                value={state.email}
                onChange={(e) => {
                  setState({ ...state, email: e.target.value });
                }}
              />
              <TextInput
                label="СНИЛС:"
                value={state.snils}
                onChange={(e) => {
                  setState({ ...state, snils: e.target.value });
                }}
              />
              <Text variant="header-2">Cпособы оповещения:</Text>
              <Checkbox
                onChange={() => {
                  setState((prev) => ({
                    ...prev,
                    notification_ways: prev.notification_ways.includes("tg")
                      ? prev.notification_ways.filter((item) => item !== "tg")
                      : [...prev.notification_ways, "tg"],
                  }));
                }}
                content="Telegram"
                checked={state.notification_ways.includes("tg")}
              />
              <Checkbox
                onChange={() => {
                  setState((prev) => ({
                    ...prev,
                    notification_ways: prev.notification_ways.includes("email")
                      ? prev.notification_ways.filter(
                          (item) => item !== "email",
                        )
                      : [...prev.notification_ways, "email"],
                  }));
                }}
                content="Email"
                checked={state.notification_ways.includes("email")}
              />
              <Button
                onClick={() => {
                  setIsSnow((prev) => !prev);
                }}
              >
                {isSnow ? "Выключить" : "Включить"} снег
              </Button>
              <Button>Подключить Telegram</Button>
              <Button
                loading={loading}
                disabled={
                  loading ||
                  (state.first_name === payload?.first_name &&
                    state.last_name === payload?.last_name &&
                    state.second_name === payload?.second_name &&
                    state.email === payload?.email &&
                    state.snils === payload?.snils &&
                    state.notification_ways === payload?.notification_ways)
                }
                onClick={save}
              >
                Сохранить
              </Button>
            </Flex>
          </Flex>
        </Modal>
      </>
    );
  }
};

export default User;
