import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import { useEffect, useState } from "react";
import { Calendar, ChevronRight } from "@gravity-ui/icons";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Icon,
  Label,
  Loader,
  Select,
  spacing,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { getTimeAsDayMonthYear } from "shared/tools";
import { Event } from "features/components/Events";
import {
  data,
  disciplines,
  types,
  disciplinesObject,
  typesObject,
} from "shared/data";
import { Link } from "react-router-dom";
import CalendarView from "features/components/CalendarView";

function CompetitionsMainContent() {
  const [typeOfView, setTypeOfView] = useState<string>("list");
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    date_filter: "",
    discipline_filter: "",
    max_age_filter: "",
    min_age_filter: "",
    organization_id: "",
    type_filter: "",
  });

  async function fetchEventsWithFilters() {
    setIsLoading(true);
    const urlSearch = new URLSearchParams(filters);
    const url = "/api/events?status=verified&" + urlSearch;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      setEvents(data);
    } else {
      setError("При получении соревнований произошла ошибка");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchEventsWithFilters();
  }, [filters]);

  return (
    <Container>
      <Flex gap={"2"} direction={"column"}>
        <Text variant="display-2">Соревнования</Text>
        <Flex wrap={"wrap"} gap={"4"} alignItems={"center"}>
          <Select
            hasClear={true}
            width={"max"}
            onUpdate={(value) => {
              setFilters({
                ...filters,
                organization_id: value[0] ? value[0] : "",
              });
            }}
            placeholder="Регион"
            options={data}
          ></Select>
          <Checkbox
            onChange={(event) => {
              setFilters({
                ...filters,
                date_filter: event.target.checked ? "upcoming" : "",
              });
            }}
          >
            Только будущие
          </Checkbox>
          <Select
            hasClear={true}
            onUpdate={(value) => {
              setFilters({ ...filters, type_filter: value[0] ? value[0] : "" });
            }}
            options={types}
            placeholder="Тип соревнований"
          ></Select>
          <Select
            hasClear={true}
            placeholder="Дисциплина"
            onUpdate={(value) => {
              setFilters({
                ...filters,
                discipline_filter: value[0] ? value[0] : "",
              });
            }}
            options={disciplines}
          ></Select>
          <TextInput
            hasClear={true}
            type="number"
            onChange={(event) =>
              setFilters({ ...filters, min_age_filter: event.target.value })
            }
            placeholder="Мин. возраст"
          />
          <TextInput
            type="number"
            hasClear={true}
            onChange={(event) =>
              setFilters({ ...filters, min_age_filter: event.target.value })
            }
            placeholder="Макс. возраст"
          />
        </Flex>
        <Flex gap={"2"}>
          <Button
            size="m"
            view={typeOfView === "list" ? "action" : "normal"}
            onClick={() => {
              setTypeOfView("list");
            }}
          >
            Список
          </Button>
          <Button
            size="m"
            view={typeOfView === "calendar" ? "action" : "normal"}
            onClick={() => {
              setTypeOfView("calendar");
            }}
          >
            Календарь
          </Button>
        </Flex>
        <Flex width={"100%"} wrap={"wrap"} gap={"2"}>
          {typeOfView === "list" ? (
            <>
              {isLoading ? (
                <Loader />
              ) : error ? (
                "произошла ошибка"
              ) : events && events.length > 0 ? (
                events.map((item, id) => (
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
                          height="196"
                          width={"320"}
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
              ) : (
                "По вашим фильтрам не соревнований"
              )}
            </>
          ) : (
            typeOfView === "calendar" && <CalendarView events={events} />
          )}
        </Flex>
      </Flex>
    </Container>
  );
}

export interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const CompetitionsPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={CompetitionsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default CompetitionsPage;
