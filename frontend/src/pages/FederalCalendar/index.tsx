import { NavigationData, CustomItems } from "@gravity-ui/page-constructor";
import { Flex, Loader, Select, Text } from "@gravity-ui/uikit";
import Calendar from "features/components/Calendar";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { data } from "shared/data";
import { fetchEvents } from "api/events";
import { Event } from "features/components/Events";

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

interface PreparedEvent {
  title: string;
  start: string;
  end: string;
  allDay: true;
}

const CalendarMainContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [preparedEvents, setPreparedEvents] = useState<PreparedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [region, setRegion] = useState("");

  useEffect(() => {
    setPreparedEvents(
      events.map((event: Event) => {
        const startDate = new Date(event.start_date);
        startDate.setDate(startDate.getDate());
        const endDate = new Date(event.end_date);
        endDate.setDate(endDate.getDate() + 1);
        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        console.log(start);
        return {
          title: event.title,
          start: start,
          end: end,
          allDay: true,
        };
      }),
    );
  }, [events]);

  useEffect(() => {
    fetchEvents(region).then((res) => {
      if (res === null) {
        setError("При загрузке мероприятий произошла ошибка");
        setLoading(false);
      } else {
        setEvents(res);
        setLoading(false);
      }
    });
  }, [region]);

  return (
    <Flex
      spacing={{ p: 3 }}
      direction="column"
      alignItems="center"
      width="100%"
    >
      <Text variant="display-1">Календарь мероприятий</Text>
      <br />
      <Flex>
        <Select
          label="Выберите регион"
          options={data}
          onUpdate={(value) => {
            setRegion(value[0]);
          }}
        />
        <br />
      </Flex>
      {loading ? (
        <>
          <br />
          <Loader />
        </>
      ) : error ? (
        <Text variant="body-1">{error as string}</Text>
      ) : preparedEvents.length === 0 ? (
        <Text variant="body-1">Мероприятий нет</Text>
      ) : (
        <Flex width="100%" justifyContent="center" height="100%">
          <div style={{ width: "100%", height: "100%" }}>
            <div>
              <Calendar events={preparedEvents} />
            </div>
          </div>
        </Flex>
      )}
    </Flex>
  );
};

const CalendarPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={CalendarMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default CalendarPage;
