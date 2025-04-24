/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Row,
  Col,
  Flex,
  Button,
  Text,
  Select,
  Loader,
} from "@gravity-ui/uikit";
import CalendarView from "features/components/CalendarView";
import Events, { Event } from "features/components/Events";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export const EventsMainContent = () => {
  const params = useParams();
  const [typeOfView, setTypeOfView] = useState("список");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    request();
  }, [location, dateFilter]);

  async function request() {
    setIsLoading(true);
    //@ts-ignore
    const url = `/api/events?organization_id=${params.id}${
      dateFilter ? `&date_filter=${dateFilter}` : ""
    }`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      // event.status === "verified" || event.status === "published"
      setEvents(
        data.filter((event: Event) => {
          return params?.id !== "0"
            ? event.status === "verified" || event.status === "published"
            : event.status === "verified";
        }),
      );
      setIsLoading(false);
      setError("");
    } else {
      setIsLoading(false);
      setError(data.detail);
    }
  }

  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <Row space="0" style={{ marginBottom: "1rem" }}>
        <Col>
          <Flex alignItems={"center"} gap={"2"}>
            <Flex justifyContent="space-between" alignItems="center" gap="3">
              <Text variant="display-1" style={{ marginRight: "1rem" }}>
                Мероприятия
              </Text>
              <Select
                onUpdate={(value) => {
                  setDateFilter(value[0]);
                }}
                options={[
                  { value: "", content: "Все мероприятия" },
                  { value: "upcoming", content: "Ближайшие" },
                ]}
                label="Фильтры"
              />
            </Flex>
            <Button
              onClick={() => setTypeOfView("список")}
              size="l"
              view={typeOfView == "список" ? "action" : "outlined"}
            >
              список
            </Button>
            /
            <Button
              onClick={() => setTypeOfView("календарь")}
              size="l"
              view={typeOfView == "календарь" ? "action" : "outlined"}
            >
              календарь
            </Button>
          </Flex>
        </Col>
      </Row>
      {typeOfView == "список" ? (
        <Events error={error} isLoading={isLoading} events={events} />
      ) : isLoading ? (
        <Loader />
      ) : (
        <CalendarView events={events} />
      )}
    </>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const EventsPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={EventsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default EventsPage;
