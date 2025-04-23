import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import { useState } from "react";
import { Calendar, ChevronRight } from "@gravity-ui/icons";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Icon,
  Label,
  Select,
  spacing,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { getTimeAsDayMonthYear } from "shared/tools";

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

function CompetitionsMainContent() {
  const [typeOfView, setTypeOfView] = useState<string>("list");
  return (
    <Container>
      <Flex gap={"2"} direction={"column"}>
        <Flex wrap={"wrap"} gap={"6"} alignItems={"center"}>
          <Text variant="display-2">Соревнования</Text>
          <Select placeholder="Сортировка"></Select>
        </Flex>
        <Flex wrap={"wrap"} gap={"4"} alignItems={"center"}>
          <Select placeholder="Статус"></Select>
          <Select placeholder="Регион"></Select>
          <Checkbox>Только будущие</Checkbox>
          <Select placeholder="Тип соревнований"></Select>
          <Select placeholder="Формат"></Select>
          <TextInput type="number" placeholder="Мин. возраст" />
          <TextInput placeholder="Макс. возраст" />
          <Button size="m" view="action">
            Искать
          </Button>
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
        <Flex wrap={"wrap"} gap={"2"}>
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
                <img src="" height="196" width={"320"} />
                <br />
                <Text variant="display-2" style={{ width: "250px" }}>
                  title
                </Text>
                <br />
                <Flex gap={"2"} wrap="wrap" alignItems={"center"}>
                  <Label size="xs" theme="warning">
                    {disciplines["algorithms"]}
                  </Label>
                  <Label size="xs" theme="info">
                    {types["interregional"]}
                  </Label>
                  <Label size="xs" theme="success">
                    12-14
                  </Label>
                </Flex>
              </Flex>
              <br />
              <Flex gap={"2"} wrap="wrap" justifyContent={"initial"}>
                <Flex alignItems={"center"} gap={"2"}>
                  <Icon data={Calendar} />
                  <Text variant="body-2">
                    {getTimeAsDayMonthYear("2024-12-18")} -{" "}
                    {getTimeAsDayMonthYear("2024-12-21")}
                  </Text>
                </Flex>
                <Button view="outlined-info">
                  Участвовать <Icon data={ChevronRight} />
                </Button>
              </Flex>
            </Flex>
          </Card>
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
                <img src="" height="196" width={"320"} />
                <br />
                <Text variant="display-2" style={{ width: "250px" }}>
                  title
                </Text>
                <br />
                <Flex gap={"2"} wrap="wrap" alignItems={"center"}>
                  <Label size="xs" theme="warning">
                    {disciplines["algorithms"]}
                  </Label>
                  <Label size="xs" theme="info">
                    {types["interregional"]}
                  </Label>
                  <Label size="xs" theme="success">
                    12-14
                  </Label>
                </Flex>
              </Flex>
              <br />
              <Flex gap={"2"} wrap="wrap" justifyContent={"initial"}>
                <Flex alignItems={"center"} gap={"2"}>
                  <Icon data={Calendar} />
                  <Text variant="body-2">
                    {getTimeAsDayMonthYear("2024-12-18")} -{" "}
                    {getTimeAsDayMonthYear("2024-12-21")}
                  </Text>
                </Flex>
                <Button view="outlined-info">
                  Участвовать <Icon data={ChevronRight} />
                </Button>
              </Flex>
            </Flex>
          </Card>
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
