import { Card, Flex, Loader, spacing, Text } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "features/components/Events";
import {
  disciplinesObject as disciplines,
  typesObject as types,
} from "shared/data";

const TeamEvents = () => {
  const params = useParams<{ id: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  async function fetchEvents() {
    setLoading(true);
    const response = await fetch(`/api/teams-events/${params.id}`);
    if (response.ok) {
      setLoading(false);
      const data = await response.json();
      setEvents(data);
    } else {
      setLoading(false);
      setError("Ошибка при загрузке данных");
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Flex direction="column" gap="2">
      {loading ? (
        <Loader />
      ) : error ? (
        <Text variant="body-3">Произошла ошибка, попробуйте позже</Text>
      ) : events.length === 0 ? (
        <Text variant="body-3">Нет мероприятий</Text>
      ) : (
        events.map((event: Event, index: number) => (
          <Flex
            key={index}
            direction="column"
            gap="1"
            className={spacing({ mr: 3 })}
          >
            <Card view="filled" width={"max"} className={spacing({ p: 3 })}>
              <Flex direction="column">
                <Text variant="display-2">{event.title}</Text>
                <Text variant="body-2">
                  Тип мероприятия: {types[event?.type]}
                </Text>
                <Text variant="body-2">
                  Дисциплина: {disciplines[event?.discipline]}
                </Text>
                <Text variant="body-2">Место: {event.placement}</Text>
              </Flex>
            </Card>
          </Flex>
        ))
      )}
    </Flex>
  );
};

export default TeamEvents;
