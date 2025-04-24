import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Container,
  Flex,
  Label,
  Loader,
  spacing,
  Text,
} from "@gravity-ui/uikit";

import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getRoleFromToken /*getTimeAsDayMonthYear*/ } from "shared/tools";
import {
  disciplinesObject as disciplines,
  typesObject as types,
} from "shared/data";
import { getPayload } from "shared/jwt-tools";

export function MyCompetitionsMainContent() {
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);
  const roles = getRoleFromToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeOfContent, setTypeOfContent] = useState<string>("all");
  const navigate = useNavigate();
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [_, setError] = useState("");

  async function fetchApplications() {
    setTypeOfContent("all");
    setLoading(true);
    const url = "/api/applications?user_id=" + payload?.sub;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setApps(data);
    } else {
      setError("При загрузке данных произошла ошибка");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (searchParams.get("type-of-content") === null) {
      setTypeOfContent("all");
      setSearchParams({ "type-of-content": "all" });
      return;
    }
    setTypeOfContent(searchParams.get("type-of-content") || "roles");
  }, [location]);

  useEffect(() => {
    if (!roles?.includes("sportsman")) {
      navigate("/");
    }
  }, []);

  function getStatus(app: any) {
    const now = new Date();
    const start = new Date(app.start_date);
    const end = new Date(app.event_date);
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "ended";
  }

  const filteredApps = apps.filter((app) => {
    const status = getStatus(app);
    return (
      typeOfContent === "all" ||
      (typeOfContent === "active" && status === "active") ||
      (typeOfContent === "ended" && status === "ended")
    );
  });

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
                  setSearchParams({ "type-of-content": "ended" });
                  setTypeOfContent("ended");
                }}
                view={typeOfContent === "ended" ? "action" : "normal"}
              >
                Завершенные
              </Button>
            </>
          )}
        </Flex>
        <br />
        <Flex width="100%" wrap="wrap" gap="4">
          {isLoading ? (
            <Loader />
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to={"/competitions/" + app.event_id}
              >
                <Card
                  key={app.application_id}
                  view="filled"
                  maxWidth={"340px"}
                  width={"max"}
                  className={spacing({ p: 3 })}
                >
                  <Flex
                    direction="column"
                    height="100%"
                    justifyContent="space-between"
                  >
                    <Flex direction="column">
                      <img src="" height="196" width="320" />
                      <br />
                      <Text variant="display-2" style={{ width: "250px" }}>
                        {app.team_name}
                      </Text>
                      <br />
                      <Flex gap="2" wrap="wrap" alignItems="center">
                        <Label size="xs" theme="warning">
                          {disciplines["algorithms"]}
                        </Label>
                        <Label size="xs" theme="info">
                          {types["interregional"]}
                        </Label>
                        <Label size="xs" theme="success">
                          {app.members.length}
                        </Label>
                      </Flex>
                    </Flex>
                    <br />
                    <Flex gap="2" wrap="wrap" justifyContent="initial">
                      <Flex alignItems="center" gap="2">
                        {/*<Icon data={Calendar} />
                      <Text variant="body-2">
                        {getTimeAsDayMonthYear(app.start_date)} -{" "}
                        {getTimeAsDayMonthYear(app.end_date)}
                      </Text>*/}
                      </Flex>
                      <Button>
                        {app.application_status === "pending"
                          ? "На модерации"
                          : app.application_status === "team"
                            ? "Набор команды"
                            : getStatus(app) === "active"
                              ? "Одобрено"
                              : "Завершился"}
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            ))
          ) : (
            <>В этой категории нет заявок</>
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
