import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Container,
  Flex,
  Icon,
  Label,
  spacing,
  Text,
} from "@gravity-ui/uikit";

import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar } from "@gravity-ui/icons";
import { getRoleFromToken, getTimeAsDayMonthYear } from "shared/tools";
import {
  disciplinesObject as disciplines,
  typesObject as types,
} from "shared/data";

export function MyCompetitionsMainContent() {
  const token = localStorage.getItem("token");
  const roles = getRoleFromToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeOfContent, setTypeOfContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("type-of-content") === null) {
      setSearchParams({ "type-of-content": "all" });
      return;
    }
    setTypeOfContent(searchParams.get("type-of-content") || "roles");
  }, [location]);

  useEffect(() => {
    setTypeOfContent(searchParams.get("type-of-content") || "roles");
    if (!roles?.includes("sportsman")) {
      navigate("/");
    }
  }, []);

  return (
    <Container style={{ width: "100%", height: "90%" }}>
      <Text variant="display-2">Мои соревнования</Text>
      <br />
      <br />
      <Flex direction={"column"}>
        <Flex gap={"2"}>
          {token && (
            <>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "all" });
                  setTypeOfContent("all");
                }}
                view={typeOfContent === "all" ? "action" : "normal"}
              >
                Все
              </Button>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "active" });
                  setTypeOfContent("active");
                }}
                view={typeOfContent === "active" ? "action" : "normal"}
              >
                Активные
              </Button>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({
                    "type-of-content": "ended",
                  });
                  setTypeOfContent("ended");
                }}
                view={typeOfContent === "ended" ? "action" : "normal"}
              >
                Завершенный
              </Button>
            </>
          )}
        </Flex>
        <br />
        <Flex width={"100%"}>
          {typeOfContent === "all" ? (
            <Flex direction={"column"} gap={"2"} wrap={"wrap"} width={"100%"}>
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
                    <Button>Одобрено</Button>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          ) : typeOfContent === "active" ? (
            <Flex direction={"column"} wrap={"wrap"} gap={"2"} width={"100%"}>
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
                    <Button>На модерации</Button>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          ) : typeOfContent === "ended" ? (
            <Flex direction={"column"} wrap={"wrap"} gap={"2"} width={"100%"}>
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
                    <Button>Завершился</Button>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    </Container>
  );
}

export interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const MyCompetitionsPage = ({
  navigation,
  navigation_custom,
}: RegionalProps) => {
  return (
    <PageConstr
      Component={MyCompetitionsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default MyCompetitionsPage;
