/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Flex,
  Loader,
  spacing,
  Card,
  Text,
  Label,
  Icon,
  Button,
} from "@gravity-ui/uikit";
import { Calendar, PencilToLine } from "@gravity-ui/icons";
import { getRoleFromToken, getTimeAsDayMonthYear } from "shared/tools";
import { getPayload } from "shared/jwt-tools";
import { getRegionId } from "shared/data";
import { useParams } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  event_image_s3_key: string;
  type:
    | "school"
    | "city"
    | "regional"
    | "interregional"
    | "russian"
    | "international";
  status: "on_verification" | "verified" | "declined" | "published" | "draft";
  discipline: "algorithms" | "hackathon" | "cybersecurity";
  start_date: string;
  end_date: string;
  age_group: string;
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
  cybersecurity: "Программирование систем информацио...",
};
const Events = ({
  isLoading,
  error,
  events,
}: {
  isLoading: boolean;
  error: unknown;
  events: Event[];
}) => {
  const roles = getRoleFromToken();
  const payload = getPayload(localStorage.getItem("token") as string);
  const params = useParams();
  const regionId = getRegionId(params.id);

  return (
    <Flex direction="row" wrap="wrap" gap="2">
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
            direction="row"
            gap="1"
            className={spacing({ mr: 3 })}
            maxWidth={"340px"}
          >
            <Card
              view="filled"
              maxWidth={"340px"}
              width={"max"}
              className={spacing({ p: 3 })}
            >
              <Flex
                direction={"column"}
                height={"100%"}
                justifyContent={"space-between"}
              >
                <Flex direction={"column"}>
                  <img
                    src={event.event_image_s3_key}
                    height="196"
                    width={"320"}
                  />
                  <br />
                  <Text variant="display-2" style={{ width: "250px" }}>
                    {event.title}
                  </Text>
                  <br />
                  <Flex gap={"2"} wrap="wrap" alignItems={"center"}>
                    <Label size="xs" theme="warning">
                      {disciplines[event.discipline]}
                    </Label>
                    <Label size="xs" theme="info">
                      {types[event.type]}
                    </Label>
                    <Label size="xs" theme="success">
                      {event.age_group}
                    </Label>
                  </Flex>
                </Flex>
                <br />
                <Flex gap={"2"} wrap="wrap" justifyContent={"initial"}>
                  <Flex alignItems={"center"} gap={"2"}>
                    <Icon data={Calendar} />
                    <Text variant="body-2">
                      {getTimeAsDayMonthYear(event.start_date)} -{" "}
                      {getTimeAsDayMonthYear(event.end_date)}
                    </Text>
                  </Flex>
                  {(roles?.includes("fsp_staff") ||
                    roles?.includes("fsp_region_head") ||
                    roles?.includes("fsp_region_staff") ||
                    roles?.includes("root")) &&
                  regionId !== "0" &&
                  payload?.region_id === regionId ? (
                    <Button view="outlined-action" size="s">
                      <Icon data={PencilToLine} />
                      Редактировать
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
            </Card>
          </Flex>
        ))
      )}
    </Flex>
  );
};

export default Events;
