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
import { Calendar, ChevronRight, PencilToLine } from "@gravity-ui/icons";
import { getRoleFromToken, getTimeAsDayMonthYear } from "shared/tools";
import { getPayload } from "shared/jwt-tools";
import { disciplinesObject, getRegionId, typesObject } from "shared/data";
import { useParams, Link } from "react-router-dom";

export interface Event {
  id: string;
  placement: string;

  title: string;
  description: string;
  event_image_s3_key: string;
  protocol_s3_key: string;
  stages: string[];
  organization_id: string;
  regions: string[];
  is_open: boolean;
  max_age: number;
  min_age: number;
  max_people: number;
  min_people: number;
  type:
    | "school"
    | "city"
    | "regional"
    | "interregional"
    | "russian"
    | "international";
  status: "on_verification" | "verified" | "declined" | "published" | "draft";
  discipline: "algorithms" | "hackathon" | "cybersecurity" | "robots" | "bpla";
  start_date: string;
  end_date: string;
  age_group: string;
  loadingAccept: boolean;
  loadingReject: boolean;
}

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
        events.map((item: Event, id: number) => (
          <Card
            key={id}
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
                  src={item.event_image_s3_key}
                  alt={item.title}
                  height="196"
                  width="320"
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <br />
                <Text variant="display-2" style={{ width: "250px" }}>
                  {item.title}
                </Text>
                <br />
                <Flex gap={"2"} wrap="wrap" alignItems={"center"}>
                  <Label size="xs" theme="warning">
                    {disciplinesObject[item.discipline]}
                  </Label>
                  <Label size="xs" theme="info">
                    {typesObject[item.type]}
                  </Label>
                  <Label size="xs" theme="success">
                    {item.age_group}
                  </Label>
                </Flex>
              </Flex>
              <br />
              <Flex gap={"2"} wrap="wrap" justifyContent={"initial"}>
                <Flex alignItems={"center"} gap={"2"}>
                  <Icon data={Calendar} />
                  <Text variant="body-2">
                    {getTimeAsDayMonthYear(item.start_date)} -{" "}
                    {getTimeAsDayMonthYear(item.end_date)}
                  </Text>
                </Flex>
                <Link to={`/competitions/${item.id}`}>
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
                  <Button view="outlined-info">
                    {new Date(item.end_date) > new Date()
                      ? "Участвовать"
                      : "Результаты"}
                    <Icon data={ChevronRight} />
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default Events;
