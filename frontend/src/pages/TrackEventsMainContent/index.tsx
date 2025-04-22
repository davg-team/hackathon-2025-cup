/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Card,
  Flex,
  Loader,
  spacing,
  Text,
  Button,
  useToaster,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTimeAsDayMonthYear } from "shared/tools";

interface Event {
  id: string;
  title: string;
  allDay: true;
  description: string;
  type: string;
  discipline: string;
  status: string;
  start_date: string;
  end_date: string;
  loading: boolean;
}

const disciplines = {
  algorithms: "Алгоритмическое программирование",
  hackathon: "Продуктовое программирование",
  cybersecurity: "Программирование систем информационной безопасности",
};

const types = {
  school: "Школьное мероприятие",
  city: "Городское мероприятие",
  regional: "Региональное мероприятие",
  interregional: "Межрегиональное мероприятие",
  russian: "Российское мероприятие",
  international: "Международное мероприятие",
};

const stasuses = {
  on_verification: "На проверке",
  verified: "Подтверждено",
  declined: "Отклонено",
  published: "Опубликовано",
  draft: "Черновик",
};

export const TrackEventsMainContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const params = useParams();
  const { add } = useToaster();

  useEffect(() => {
    async function request() {
      setIsLoading(true);
      const url = `/api/events?organization_id=${params.id}`;
      const response = await fetch(url);
      let data = await response.json();
      if (response.ok) {
        data = data.filter((event: Event) => {
          if (event.status !== "verified") {
            return event;
          }
        });
        data.sort((a: Event, b: Event) => {
          const statuses = [
            "draft",
            "on_verification",
            "published",
            "declined",
            "verified",
          ].reverse();
          return statuses.indexOf(b.status) - statuses.indexOf(a.status);
        });
        setEvents(
          data.map((event: Event) => ({
            ...event,
            loading: false,
          })),
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
    <Flex direction="column" gap="2">
      <Text variant="display-2">Отслеживание мероприятий</Text>
      <Flex direction="column">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Text>Произошла ошибка</Text>
        ) : events.length === 0 ? (
          <Text>Мероприятий нет</Text>
        ) : (
          <Flex direction="column" gap="2" className={spacing({ p: 3 })}>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Text variant="body-3">Произошла ошибка, попробуйте позже</Text>
            ) : events.length === 0 ? (
              <Text variant="body-3">Нет мероприятий</Text>
            ) : (
              events.map((event: Event, index: number) => (
                <Card
                  view="filled"
                  width={"max"}
                  key={index}
                  className={spacing({ p: 3 })}
                >
                  <Flex direction="row" justifyContent="space-between">
                    <Flex direction="column">
                      <Text variant="display-2">{event.title}</Text>
                      <Text variant="body-3">
                        {/* @ts-ignore */}
                        Описание: {event.description}
                      </Text>
                      {/* @ts-ignore */}
                      <Text variant="body-3">Тип: {types[event.type]}</Text>
                      <Text variant="body-3">
                        {/* @ts-ignore */}
                        Дисциплина: {disciplines[event.discipline]}
                      </Text>
                      <Text variant="body-3">
                        Даты проведения:
                        {/* @ts-ignore */}
                        {getTimeAsDayMonthYear(event.start_date)} -{" "}
                        {/* @ts-ignore */}
                        {getTimeAsDayMonthYear(event.end_date)}
                      </Text>
                      <Text variant="body-3">
                        {/* @ts-ignore */}
                        Статус: {stasuses[event.status]}
                      </Text>
                    </Flex>
                    {event.status === "draft" ? (
                      <Flex alignItems="center" justifyContent="center" gap="1">
                        <Button
                          view="action"
                          onClick={async () => {
                            setEvents(
                              events.map((item, i) => {
                                if (i === index) {
                                  return { ...item, loading: true };
                                }
                                return item;
                              }),
                            );
                            if (
                              event.type === "school" ||
                              event.type === "city"
                            ) {
                              const response = await fetch(
                                "/api/events/" + event.id,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "token",
                                    )}`,
                                  },
                                  body: JSON.stringify({
                                    status: "published",
                                    message: "",
                                  }),
                                },
                              );

                              if (response.ok) {
                                setEvents(
                                  events.map((e) => {
                                    if (e.id === event.id) {
                                      return {
                                        ...e,
                                        status: "published",
                                        loading: false,
                                      };
                                    }
                                    return e;
                                  }),
                                );
                                add({
                                  title: "",
                                  name: "reject-event-ok",
                                  theme: "success",
                                  autoHiding: 5000,
                                });
                              } else {
                                setEvents(
                                  events.map((e) => {
                                    if (e.id === event.id) {
                                      return {
                                        ...e,
                                        loading: false,
                                      };
                                    }
                                    return e;
                                  }),
                                );
                                add({
                                  title: "При отклонении произошла ошибка",
                                  name: "reject-event-ok",
                                  theme: "danger",
                                  autoHiding: 5000,
                                });
                              }
                            } else {
                              const response = await fetch(
                                "/api/events/" + event.id,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "token",
                                    )}`,
                                  },
                                  body: JSON.stringify({
                                    status: "on_verification",
                                    message: "",
                                  }),
                                },
                              );

                              if (response.ok) {
                                setEvents(
                                  events.map((e) => {
                                    if (e.id === event.id) {
                                      return {
                                        ...e,
                                        status: "on_verification",
                                        loadingReject: false,
                                      };
                                    }
                                    return e;
                                  }),
                                );
                                add({
                                  title: "Отправлено на проверку",
                                  name: "reject-event-ok",
                                  theme: "success",
                                  autoHiding: 5000,
                                });
                              } else {
                                setEvents(
                                  events.map((e) => {
                                    if (e.id === event.id) {
                                      return {
                                        ...e,
                                        loadingReject: false,
                                      };
                                    }
                                    return e;
                                  }),
                                );
                                add({
                                  title:
                                    "При отправке на проверку произошла ошибка",
                                  name: "reject-event-ok",
                                  theme: "danger",
                                  autoHiding: 5000,
                                });
                              }
                            }
                          }}
                          loading={event.loading}
                        >
                          Опубликовать
                        </Button>
                      </Flex>
                    ) : null}
                  </Flex>
                </Card>
              ))
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const TrackEventsPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={TrackEventsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default TrackEventsPage;
