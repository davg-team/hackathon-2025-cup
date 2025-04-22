/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Flex, Loader, spacing, Card, Text } from "@gravity-ui/uikit";
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
  status: "on_verification" | "verified" | "declined" | "published" | 'draft';
  discipline: "algorithms" | "hackathon" | "cybersecurity";
  start_date: string;
  end_date: string;
}

const types = {
  school: "Школьное мероприятие",
  city: "Городское мероприятие",
  regional: "Региональное мероприятие",
  interregional: "Межрегиональное мероприятие",
  russian: "Российское мероприятие",
  international: "Международное мероприятие",
};

const disciplines = {
  algorithms: "Алгоритмическое программирование",
  hackathon: "Продуктовое программирование",
  cybersecurity: "Программирование систем информационной безопасности",
};
const Events = ({isLoading, error, events}: {
  isLoading: boolean;
  error: unknown;
  events: Event[];
}) => {
  return (
    <Flex direction="column" gap="2">
      {isLoading ? (
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
                <Text variant="body-3">Описание: {event.description}</Text>
                <Text variant="body-3">Тип: {types[event.type]}</Text>
                <Text variant="body-3">
                  Дисциплина: {disciplines[event.discipline]}
                </Text>
                <Text variant="body-3">
                  Даты проведения: {getTimeAsDayMonthYear(event.start_date)} -{" "}
                  {getTimeAsDayMonthYear(event.end_date)}
                </Text>
              </Flex>
            </Card>
          </Flex>
        ))
      )}
    </Flex>
  );
};

export default Events;