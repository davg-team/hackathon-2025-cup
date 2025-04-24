import { LogoTelegram } from "@gravity-ui/icons";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Card,
  Col,
  Container,
  Flex,
  Icon,
  Label,
  Loader,
  Text,
  UserLabel,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPayload } from "shared/jwt-tools";

function ProfileMainContent() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setIsLoading(true);
    const url = "/api/teams?user_id=" + payload?.sub;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTeams(data);
    } else {
    }
    setIsLoading(false);
  }

  return (
    <Container>
      <Flex alignItems={"center"} spacing={{ mb: "10" }} gap={"10"} wrap="wrap">
        <Flex>
          <img
            src={payload?.avatar}
            width={"160"}
            style={{ borderRadius: "50%" }}
            height={"160"}
          />
        </Flex>
        <Flex>
          <Flex direction="column" gap={"2"}>
            <Text variant={"display-2"}>
              {payload?.last_name} {payload?.first_name}
            </Text>
            <Flex gap={"4"} wrap="wrap">
              {payload?.email && (
                <UserLabel type="email" text={payload?.email} />
              )}
              {payload?.tg_id && (
                <UserLabel
                  avatar={<Icon width={"28"} data={LogoTelegram} />}
                  text={payload.tg_id}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        gap={"4"}
        width={"100%"}
        direction={{ s: "column", l: "row-reverse" }}
      >
        <Col s={"12"} l={"4"}>
          <Card width={"100%"} spacing={{ p: "5" }} view="raised">
            <Flex gap={"4"} direction={"column"}>
              <Text variant="subheader-3">Результаты</Text>
              <Flex
                wrap={"wrap"}
                direction={{ s: "row", l: "column" }}
                gap={"4"}
              >
                <Flex alignItems={"center"} gap={"4"}>
                  <img width={50} height={50} src="/svg/gold_medal.svg" />
                  <Text variant="header-2">1</Text>
                </Flex>
                <Flex alignItems={"center"} gap={"4"}>
                  <img width={50} height={50} src="/svg/silver_medal.svg" />
                  <Text variant="header-2">1</Text>
                </Flex>
                <Flex alignItems={"center"} gap={"4"}>
                  <img width={50} height={50} src="/svg/bronze_medal.svg" />
                  <Text variant="header-2">1</Text>
                </Flex>
                <Flex alignItems={"center"} gap={"4"}>
                  <img width={50} height={50} src="/svg/certificate.svg" />
                  <Text variant="header-2">1</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
        <Col s={"12"} l={"8"}>
          <Flex direction={"column"}>
            <Text variant="display-2">Мои команды</Text>
            <Flex direction={"column"} gap={"4"}>
              {isLoading ? (
                <Loader />
              ) : teams.length > 0 ? (
                teams.map((item, id) => (
                  //@ts-ignore
                  <Link key={id} to={"/teams/" + item.id}>
                    <Card view="raised" spacing={{ p: "6" }} width={"100%"}>
                      <Flex
                        justifyContent={"space-between"}
                        wrap="wrap"
                        alignItems={"center"}
                      >
                        <Flex alignItems={"center"} wrap={"wrap"}>
                          {/*@ts-ignore*/}
                          <Text variant="display-1">{item.name}</Text>
                        </Flex>
                        <Flex wrap="wrap" gap={"6"}>
                          <Flex alignItems={"center"} gap={"2"}>
                            <img
                              width={20}
                              height={20}
                              src="/svg/gold_medal.svg"
                            />
                            <Text variant="header-2">1</Text>
                          </Flex>
                          <Flex alignItems={"center"} gap={"2"}>
                            <img
                              width={20}
                              height={20}
                              src="/svg/silver_medal.svg"
                            />
                            <Text variant="header-2">1</Text>
                          </Flex>
                          <Flex alignItems={"center"} gap={"2"}>
                            <img
                              width={20}
                              height={20}
                              src="/svg/bronze_medal.svg"
                            />
                            <Text variant="header-2">1</Text>
                          </Flex>
                          <Flex alignItems={"center"} gap={"2"}>
                            <img
                              width={20}
                              height={20}
                              src="/svg/certificate.svg"
                            />
                            <Text variant="header-2">1</Text>
                          </Flex>
                          <Flex>
                            <Flex alignItems={"center"} gap={"2"}>
                              <Text variant="header-1">Рейтинг</Text>
                              <Label theme="warning">5.0</Label>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Link>
                ))
              ) : (
                <Text variant="header-1">
                  Этот спортсмен не состоит в командах
                </Text>
              )}
            </Flex>
          </Flex>
        </Col>
      </Flex>
    </Container>
  );
}

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const ProfilePage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={ProfileMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default ProfilePage;
