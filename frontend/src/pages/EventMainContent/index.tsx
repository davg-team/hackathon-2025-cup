import { ArrowLeft } from "@gravity-ui/icons";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Container,
  Flex,
  Icon,
  Loader,
  Skeleton,
  Text,
} from "@gravity-ui/uikit";
import { Event } from "features/components/Events";
import PageConstr from "features/components/PageConstr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { disciplinesObject, regionMap } from "shared/data";
import { getRoleFromToken } from "shared/tools";
import { Context } from "app/Context";
import { getPayload, isExpired } from "shared/jwt-tools";

function EventMainContent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  const eventId = params["id"];
  const navigate = useNavigate();
  const roles = getRoleFromToken();
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);
  const { setIsOpenLogin } = useContext(Context);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      const url = `/api/events/${eventId}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        navigate("404");
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <Container>
      <Flex alignItems={"center"} spacing={{ mb: "4" }} gap={"4"}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Link to={"/competitions"}>
              <Button view="flat" size="m">
                <Icon data={ArrowLeft} />
              </Button>
            </Link>
            <Text variant={"display-2"}>Кубок России</Text>
          </>
        )}
      </Flex>
      {isLoading ? (
        <Flex
          width={"100%"}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Loader />
        </Flex>
      ) : event ? (
        <Card view="raised" width={"100%"} spacing={{ p: "10" }}>
          <Flex
            justifyContent={"space-between"}
            gap={"6"}
            direction={{ l: "row", s: "column-reverse" }}
          >
            <Flex direction={"column"} gap={"4"} width={"100%"}>
              <span>
                <Text variant="header-1">Формат:</Text>{" "}
                <Text variant="subheader-3">
                  {event?.title || "Название не указано"}
                </Text>
              </span>
              <span>
                <Text variant="header-1">Дисциплинаa:</Text>{" "}
                <Text variant="subheader-3">
                  {event?.discipline &&
                    (disciplinesObject[event?.discipline] ||
                      event.discipline ||
                      "Не указано")}
                </Text>
              </span>
              <span>
                <Text variant="header-1">Возрастные ограничения:</Text>{" "}
                <Text variant="subheader-3">
                  {event?.age_group || "Отсутствуют"}
                </Text>
              </span>
              <span>
                <Text variant="header-1">Организаторы:</Text>{" "}
                <Text variant="subheader-3">
                  {regionMap[event.organization_id] || "Не указано"}
                </Text>
              </span>
              <Text variant="header-1">Этапы:</Text>
              {event.stages.length > 0 ? (
                event.stages.map((item) => (
                  <Text variant="subheader-3" style={{ paddingLeft: "2rem" }}>
                    {item}
                  </Text>
                ))
              ) : (
                <Text variant="subheader-3">Этапы не указаны</Text>
              )}
              <Text variant="header-1">Описание:</Text>
              <Text variant="subheader-3">{event.description}</Text>
            </Flex>
            <Flex
              gap={"4"}
              width={"100%"}
              direction={"column"}
              justifyContent={"space-between"}
            >
              <img
              src={event.event_image_s3_key}
              style={{
                width: "100%",
                maxWidth: "600px",
                maxHeight: "400px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              alt="Event"
              />
              {new Date(event.end_date) > new Date() ? (
                <>
                  {token && !isExpired(token) ? (
                    roles &&
                    roles?.includes("sportsman") &&
                    payload &&
                    event.regions.includes(payload?.region_id) ? (
                      <Link
                        style={{ alignSelf: "end", maxWidth: "max-content" }}
                        to={`/competitions/register?${new URLSearchParams({
                          max_age: String(event.max_age),
                          min_age: String(event.min_age),
                          min_people: String(event.min_people),
                          is_open: String(event.is_open),
                          max_people: String(event.max_people),
                          event_id: String(event.id),
                          // : String(event.),
                        })}`}
                      >
                        <Button view="action">Принять участие</Button>
                      </Link>
                    ) : (
                      <Text
                        style={{ alignSelf: "end", maxWidth: "max-content" }}
                        color="hint"
                        variant="subheader-3"
                      >
                        Для регистрации вы должны быть спортсменом и
                        принадлежать к регионам, в которых проводится это
                        соревнование
                      </Text>
                    )
                  ) : (
                    <Button
                      onClick={() => {
                        setIsOpenLogin(true);
                      }}
                      view="action"
                    >
                      Войти/Регистрация
                    </Button>
                  )}
                </>
              ) : (
                <a download href={event.protocol_s3_key}>
                  Скачать протокол
                </a>
              )}
              {}
            </Flex>
          </Flex>
        </Card>
      ) : (
        <>{navigate("/404")}</>
      )}
    </Container>
  );
}

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const EventPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={EventMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default EventPage;
