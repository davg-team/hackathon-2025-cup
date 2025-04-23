import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import { Button, Card, Container, Flex, Text } from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { AcceptEventsMainContent } from "pages/AcceptEvents";
import { PeopleMainContent } from "pages/People";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoleFromToken } from "shared/tools";

interface IData {
  img: string;
  captain: string;
  title: string;
}

function ApplicationCard({ data }: { data: IData }) {
  return (
    <Card spacing={{ p: "3" }} view="raised" width={"100%"}>
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex gap={"2"} width={"60%"}>
          <img src={data.img} width={72} height={72} />
          <Flex direction={"column"}>
            <Text variant="display-1">{data.title}</Text>
            <Text variant="subheader-3">Капитан: {data.captain}</Text>
          </Flex>
        </Flex>
        <Flex gap={"2"}>
          <Button view="action">Принять</Button>
          <Button view="outlined-action">Отколнить</Button>
        </Flex>
      </Flex>
    </Card>
  );
}

export function ApplicationsMainContent() {
  const token = localStorage.getItem("token");
  const roles = getRoleFromToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeOfContent, setTypeOfContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("type-of-content") === null) {
      setSearchParams({ "type-of-content": "roles" });
      return;
    }
    setTypeOfContent(searchParams.get("type-of-content") || "roles");
  }, [location]);

  useEffect(() => {
    setTypeOfContent(searchParams.get("type-of-content") || "roles");
    if (
      !(
        roles?.includes("fsp_staff") ||
        roles?.includes("fsp_region_head") ||
        roles?.includes("fsp_region_staff") ||
        roles?.includes("sportsman") ||
        roles?.includes("root")
      )
    ) {
      navigate("/");
    }
  }, []);

  return (
    <Container style={{ width: "100%" }}>
      <Text variant="display-2">Заявки</Text>
      <Flex direction={"column"}>
        <Flex gap={"2"}>
          {token && (
            <>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "roles" });
                  setTypeOfContent("roles");
                }}
                view={typeOfContent === "roles" ? "action" : "normal"}
              >
                Роли
              </Button>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "events" });
                  setTypeOfContent("events");
                }}
                view={typeOfContent === "events" ? "action" : "normal"}
              >
                Мероприятия
              </Button>
              <Button
                size="l"
                onClick={() => {
                  setSearchParams({
                    "type-of-content": "competitions-requests",
                  });
                  setTypeOfContent("competitions-requests");
                }}
                view={
                  typeOfContent === "competitions-requests"
                    ? "action"
                    : "normal"
                }
              >
                Участие
              </Button>
            </>
          )}
        </Flex>
        <Flex width={"100%"}>
          {typeOfContent === "roles" ? (
            <PeopleMainContent />
          ) : typeOfContent === "events" ? (
            <AcceptEventsMainContent />
          ) : typeOfContent === "competitions-requests" ? (
            <Flex width={"100%"} direction={"column"} gap={"2"}>
              <br />
              <br />
              <ApplicationCard
                data={{ title: "Соперники", captain: "КФУшник", img: "" }}
              />
              <ApplicationCard
                data={{ title: "Соперники", captain: "КФУшник", img: "" }}
              />
              <ApplicationCard
                data={{ title: "Соперники", captain: "КФУшник", img: "" }}
              />
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
const ApplicationsPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={ApplicationsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default ApplicationsPage;
