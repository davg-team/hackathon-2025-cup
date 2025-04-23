/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Col,
  Flex,
  Loader,
  Row,
  Text,
  useToaster,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";

const roles = {
  fsp_staff: "Представитель ФСП",
  fsp_region_staff: "Представитель регионального отделения ФСП",
  fsp_region_head: "Руководитель регионального отделения ФСП",
  sportsman: "Спортсмен",
};

interface People {
  id: string;
  requester_id: string;
  requester_type: string;
  requested_id: string;
  requested_type: string;
  status: string;
  subject: string;
  comment: string;
  created_at: string;
  type: string;
  loadingAccept: boolean;
  loadingReject: boolean;
}

export const PeopleMainContent = () => {
  const [people, setPeople] = useState<People[]>([]);
  const [acceptedPeople, setAcceptedPeople] = useState<People[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const { add } = useToaster();

  useEffect(() => {
    async function request() {
      setIsLoading(true);
      const url = "/api/auth/requests/role/me";
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPeople(
          data.map((person: People) => {
            return {
              ...person,
              loadingAccept: false,
              loadingReject: false,
            };
          }),
        );
        setPeople(data.filter((person: People) => person.status === "waiting"));
        setAcceptedPeople(
          data.filter((person: People) => person.status === "accepted"),
        );
        setIsLoading(false);
        setError("");
      } else {
        setIsLoading(false);
        setError(data.detail);
      }
    }

    request();
  }, []);

  return (
    <Flex direction="column" width="100%">
      <br />
      <br />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Text>Произошла ошибка, попробуйте позже</Text>
      ) : people.length === 0 ? (
        <Text variant="display-1">Нет запросов</Text>
      ) : (
        <>
          <Text variant="display-1">Заявки на добавление в систему</Text>
          {people?.map((person) => (
            <Card
              theme="normal"
              view="outlined"
              style={{ padding: "1rem", marginBottom: "1rem" }}
              key={person.id}
            >
              <Row space="0">
                <Col>
                  <Flex direction="column" key={person.id}>
                    <Text variant="display-1">{person.comment}</Text>
                    <Text variant="body-3">
                      {/* @ts-ignore */}
                      Запрашиваемая роль: {roles[person.subject]}
                    </Text>
                  </Flex>
                </Col>
                <Flex justifyContent="flex-end" alignItems="center" gap="2">
                  <Button
                    view="action"
                    size="l"
                    disabled={person.loadingAccept || person.loadingReject}
                    loading={person.loadingAccept}
                    onClick={async () => {
                      setPeople(
                        people.map((p) => {
                          if (p.id === person.id) {
                            return { ...p, loadingAccept: true };
                          }
                          return p;
                        }),
                      );
                      const response = await fetch(
                        `/api/auth/requests/role/${person.id}/respond?action=accept`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                              "token",
                            )}`,
                          },
                        },
                      );
                      setPeople(
                        people.map((p) => {
                          if (p.id === person.id) {
                            return { ...p, loadingAccept: false };
                          }
                          return p;
                        }),
                      );

                      if (response.ok) {
                        setAcceptedPeople(
                          people.filter((p) => p.id !== person.id),
                        );
                        setPeople(people.filter((p) => p.id !== person.id));
                        add({
                          title: "Добавление прошло успешно",
                          name: "add-people-ok",
                          theme: "success",
                          autoHiding: 5000,
                        });
                      } else {
                        add({
                          title: "При добавлении произошла ошибка",
                          name: "add-people-err",
                          theme: "danger",
                          autoHiding: 5000,
                        });
                      }
                    }}
                  >
                    принять
                  </Button>
                  /
                  <Button
                    view="normal"
                    size="l"
                    loading={person.loadingReject}
                    disabled={person.loadingAccept || person.loadingReject}
                    onClick={async () => {
                      setPeople(
                        people.map((p) => {
                          if (p.id === person.id) {
                            return { ...p, loadingReject: true };
                          }
                          return p;
                        }),
                      );
                      const response = await fetch(
                        `/api/auth/requests/role/${person.id}/respond?action=reject`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                              "token",
                            )}`,
                          },
                        },
                      );
                      setPeople(
                        people.map((p) => {
                          if (p.id === person.id) {
                            return { ...p, loadingReject: false };
                          }
                          return p;
                        }),
                      );
                      if (response.ok) {
                        setPeople(people.filter((p) => p.id !== person.id));
                        add({
                          title: "Отлонение прошло успешно",
                          name: "reject-people-ok",
                          theme: "success",
                          autoHiding: 5000,
                        });
                      } else {
                        add({
                          title: "При отклонении произошла ошибка",
                          name: "reject-people-err",
                          theme: "danger",
                          autoHiding: 5000,
                        });
                      }
                    }}
                  >
                    отклонить
                  </Button>
                </Flex>
              </Row>
            </Card>
          ))}
          <Text variant="display-2">Принятые представители</Text>
          {acceptedPeople?.map((person) => (
            <Card
              theme="normal"
              view="outlined"
              style={{ padding: "1rem", marginBottom: "1rem" }}
            >
              <Row space="0">
                <Col>
                  <Flex direction="column" key={person.id}>
                    <Text variant="display-1">{person.comment}</Text>
                    <Text variant="body-3">
                      {/* @ts-ignore */}
                      Запрашиваемая роль: {roles[person.subject]}
                    </Text>
                  </Flex>
                </Col>
              </Row>
            </Card>
          ))}
        </>
      )}
    </Flex>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const PeoplePage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={PeopleMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default PeoplePage;
