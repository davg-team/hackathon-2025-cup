import {
  Button,
  Card,
  Col,
  Container,
  Flex,
  Loader,
  Modal,
  Row,
  Text,
  TextArea,
  useToaster,
} from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import { getTimeAsDayMonthYear } from "shared/tools";

interface Event {
  id: string;
  title: string;
  description: string;
  type:
    | "school"
    | "city"
    | "regional"
    | "interregional"
    | "russian"
    | "international";
  status: "on_verification" | "verified" | "declined";
  discipline: "algorithms" | "hackathon" | "cybersecurity";
  start_date: string;
  end_date: string;
  loadingAccept: boolean;
  loadingReject: boolean;
}

const types = {
  school: "Школьное мероприятие",
  city: "Городское мероприятие",
  regional: "Региональное мероприятие",
  interregional: "Межрегиональное мероприятие",
  russian: "Российское мероприятие",
  international: "Международное мероприятие",
};

const MainContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { add } = useToaster();

  useEffect(() => {
    async function request() {
      setIsLoading(true);
      const url = "/api/events";
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (response.ok) {
        data = data.map((event: Event) => ({
          ...event,
          loadingAccept: false,
          loadingReject: false,
        }));
        setEvents(
          data.filter((event: Event) => event.status === "on_verification")
        );
        setIsLoading(false);
        setError("");
      } else {
        setIsLoading(false);
        setError(data.detail);
      }
    }

    request();
  }, []);

  return (
    <Container>
      <Flex direction="column">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Text>Произошла ошибка, попробуйте позже</Text>
        ) : events.length === 0 ? (
          <Text variant="display-2">Нет запросов</Text>
        ) : (
          <>
            <Text variant="display-2">Заявки на добавление в систему</Text>
            {events.map((event) => (
              <Card
                theme="normal"
                view="outlined"
                key={event.id}
                style={{ padding: "1rem", marginBottom: "1rem" }}
              >
                <Row space="0">
                  <Col>
                    <Flex direction="column">
                      <Text variant="display-1">{event.title}</Text>
                      <Text variant="body-3">
                        Описание: {event.description}
                      </Text>
                      <Text variant="body-3">Тип: {types[event.type]}</Text>
                      <Text variant="body-3">
                        Дисциплина: {event.discipline}
                      </Text>
                      <Text variant="body-3">
                        Даты проведения:{" "}
                        {getTimeAsDayMonthYear(event.start_date)} -{" "}
                        {getTimeAsDayMonthYear(event.end_date)}
                      </Text>
                    </Flex>
                  </Col>
                  <Flex justifyContent="flex-end" alignItems="center" gap="2">
                    <Button
                      view="action"
                      loading={event.loadingAccept}
                      disabled={event.loadingAccept || event.loadingReject}
                      onClick={async () => {
                        setEvents(
                          events.map((e) => {
                            if (e.id === event.id) {
                              return {
                                ...e,
                                loadingAccept: true,
                              };
                            }
                            return e;
                          })
                        );
                        const response = await fetch(
                          "/api/events/" + event.id,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            body: JSON.stringify({
                              status: "verified",
                              message: "",
                            }),
                          }
                        );

                        setEvents(
                          events.map((e) => {
                            if (e.id === event.id) {
                              return {
                                ...e,
                                loadingAccept: false,
                              };
                            }
                            return e;
                          })
                        );

                        if (response.ok) {
                          add({
                            title: "Заявка принята",
                            name: "reject-event-ok",
                            theme: "success",
                            autoHiding: 5000,
                          });
                          setEvents(
                            events.filter((event) => event.id !== event.id)
                          );
                        } else {
                          add({
                            title: "При принятии произошла ошибка",
                            name: "reject-event-ok",
                            theme: 'danger',
                            autoHiding: 5000,
                          });
                        }
                      }}
                    >
                      принять
                    </Button>
                    /
                    <Button
                      disabled={event.loadingAccept || event.loadingReject}
                      view="normal"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      отклонить
                    </Button>
                  </Flex>
                </Row>
                <Modal open={open} onClose={() => setOpen(false)}>
                  <Flex spacing={{ p: 2 }} direction="column" gap="2">
                    <Text variant="display-1">Причина отклонения:</Text>
                    <TextArea
                      placeholder="Причина отклонения"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                    <Button
                      disabled={!message}
                      onClick={async () => {
                        setEvents(
                          events.map((e) => {
                            if (e.id === event.id) {
                              return {
                                ...e,
                                loadingReject: true,
                              };
                            }
                            return e;
                          })
                        )

                        const response = await fetch("/api/events/" + event.id, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                          body: JSON.stringify({
                            status: "declined",
                            message: message,
                          }),
                        });

                        setEvents(
                          events.map((e) => {
                            if (e.id === event.id) {
                              return {
                                ...e,
                                loadingReject: false,
                              };
                            }
                            return e;
                          })
                        );

                        if (response.ok) {
                          setEvents(
                            events.filter((event) => event.id !== event.id)
                          );
                          add({
                            title: "Заявка отклонена",
                            name: "reject-event-ok",
                            theme: "success",
                            autoHiding: 5000,
                          });
                        } else {
                          add({
                            title: "При отклонении произошла ошибка",
                            name: "reject-event-ok",
                            theme: "danger",
                            autoHiding: 5000,
                          });
                        }
                      }}
                      view="action"
                    >
                      Отправить
                    </Button>
                  </Flex>
                </Modal>
              </Card>
            ))}
          </>
        )}
      </Flex>
    </Container>
  );
};

export { MainContent as AcceptEventsMainContent };
