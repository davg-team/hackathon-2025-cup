/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Flex,
  Text,
  Card,
  Loader,
  Button,
  Icon,
  useToaster,
  Modal,
  TextInput,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPayload } from "shared/jwt-tools";

interface Team {
  id: number;
  name: string;
  description: string;
  fsp_id: string;
  captain: string;
  participants: string[];
}

export const TeamsMainContent = () => {
  const params = useParams();
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    fsp_id: params.id || "",
    captain: "",
    participants: [],
  });
  const [editTeam, setEditTeam] = useState({
    name: "",
    description: "",
    fsp_id: params.id || "",
    captain: "",
    participants: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addCount, setAddCount] = useState<number>(0);
  const [editCount, setEditCount] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openModal1, setOpenModal1] = useState<boolean>(false);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<unknown>(null);
  const { add } = useToaster();
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);

  async function request() {
    setIsLoading(true);
    const response = await fetch(
      `/api/teams${params.id && "?fsp_id=" + params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      setTeams(data);
      console.log(data);
    } else {
      setError("Ошибка загрузки данных");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    request();
  }, []);

  async function handleAdd() {
    setIsAdding(true);
    const response = await fetch("/api/teams/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newTeam,
        fsp_id: params.id,
        participants: newTeam.participants,
      }),
    });
    if (response.ok) {
      add({
        title: "Команда добавлена",
        theme: "success",
        name: "add-success",
      });
      request();
      setIsAdding(false);
      setOpenModal1(false);
      setNewTeam({
        name: "",
        description: "",
        fsp_id: params.id || "",
        captain: "",
        participants: [],
      });
    } else {
      add({
        title: "При добавлении карточки произошла ошибка",
        theme: "danger",
        name: "add-failed",
      });
      setIsAdding(false);
    }
  }

  async function handleEdit() {
    setIsEditing(true);
    // @ts-ignore
    const response = await fetch("/api/teams/" + editTeam.id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editTeam,
        fsp_id: params.id,
        participants: editTeam.participants,
      }),
    });
    if (response.ok) {
      add({
        title: "Команда обновлена",
        theme: "success",
        name: "add-success",
      });
      request();
      setIsEditing(false);
      setOpenModal2(false);
    } else {
      add({
        title: "При добавлении команды произошла ошибка",
        theme: "danger",
        name: "add-failed",
      });
      setIsEditing(false);
    }
  }

  // @ts-ignore
  async function handleDelete(item) {
    const response = await fetch("/api/teams/" + item.id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      add({
        title: "Команда удалена",
        theme: "success",
        name: "delete-success",
      });
      request();
    } else {
      add({
        title: "При удалении команды произошла ошибка",
        theme: "danger",
        name: "delete-failed",
      });
    }
  }

  return (
    <Flex width={"100%"} direction="column" spacing={{ m: 3 }} gap="1">
      {/* edit create content */}
      <Modal open={openModal1}>
        <Card theme="normal">
          <Flex direction="column" spacing={{ p: 3 }}>
            <Flex justifyContent="center" alignItems="center" gap="3">
              <Text variant="display-2">Создание команды</Text>
              <Button
                onClick={() => {
                  setOpenModal1(false);
                  setNewTeam({
                    name: "",
                    description: "",
                    fsp_id: params.id || "",
                    captain: "",
                    participants: [],
                  });
                }}
              >
                <Icon
                  data={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg>'
                  }
                />
              </Button>
            </Flex>
            <Flex direction="column" gap="1">
              <TextInput
                label="Название команды:"
                value={newTeam?.name}
                onChange={(e) => {
                  setNewTeam((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
              <TextInput
                label="Капитан:"
                value={newTeam?.captain}
                onChange={(e) => {
                  setNewTeam((prev) => ({ ...prev, captain: e.target.value }));
                }}
              />
              <TextInput
                label="Описание:"
                value={newTeam?.description}
                onChange={(e) => {
                  setNewTeam((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
              <Text variant="body-3">Члены команды:</Text>
              <TextInput
                label="Количество:"
                type="number"
                value={addCount.toString()}
                onChange={(e) => {
                  setAddCount(Number(e.target.value));
                }}
              />
              {Array.from({ length: addCount }).map((_, index) => {
                return (
                  <TextInput
                    key={index}
                    label={`${index + 1}:`}
                    value={newTeam?.participants[index]}
                    onChange={(e) => {
                      setNewTeam((prev) => {
                        const newParticipants = [...prev.participants];
                        // @ts-ignore
                        newParticipants[index] = e.target.value;
                        return { ...prev, participants: newParticipants };
                      });
                    }}
                  />
                );
              })}
              <Button
                disabled={
                  !newTeam?.name ||
                  !newTeam?.description ||
                  !newTeam?.fsp_id ||
                  !newTeam?.captain ||
                  newTeam?.participants.length === 0
                }
                view="action"
                loading={isAdding}
                onClick={handleAdd}
              >
                Создать
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Modal>
      {/* edit modal content */}
      <Modal open={openModal2}>
        <Card theme="normal">
          <Flex direction="column" spacing={{ p: 3 }}>
            <Flex justifyContent="center" alignItems="center" gap="3">
              <Text variant="display-2">Изменение</Text>
              <Button
                onClick={() => {
                  setOpenModal2(false);
                }}
              >
                <Icon
                  data={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg>'
                  }
                />
              </Button>
            </Flex>
            <Flex direction="column" gap="1">
              <TextInput
                label="Название команды:"
                value={editTeam?.name}
                onChange={(e) => {
                  setEditTeam((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
              <TextInput
                label="Капитан:"
                value={editTeam?.captain}
                onChange={(e) => {
                  setEditTeam((prev) => ({ ...prev, captain: e.target.value }));
                }}
              />
              <TextInput
                label="Описание:"
                value={editTeam?.description}
                onChange={(e) => {
                  setEditTeam((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
              <Text variant="body-3">Члены команды:</Text>
              <TextInput
                label="Количество:"
                type="number"
                value={editCount.toString()}
                onChange={(e) => {
                  setEditCount(Number(e.target.value));
                }}
              />
              {Array.from({ length: editCount }).map((_, index) => {
                return (
                  <TextInput
                    key={index}
                    label={`${index + 1}:`}
                    value={editTeam?.participants[index]}
                    onChange={(e) => {
                      setEditTeam((prev) => {
                        const newParticipants = [...prev.participants];
                        // @ts-ignore
                        newParticipants[index] = e.target.value;
                        return { ...prev, participants: newParticipants };
                      });
                    }}
                  />
                );
              })}
              <Button
                disabled={
                  !editTeam?.name ||
                  !editTeam?.description ||
                  !editTeam?.fsp_id ||
                  !editTeam?.captain ||
                  editTeam?.participants.length === 0
                }
                view="action"
                loading={isEditing}
                onClick={handleEdit}
              >
                Изменить
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Modal>
      <Flex width={"100%"} justifyContent="space-between" alignItems="center">
        <Text variant="display-2">Команды</Text>
        {/* @ts-ignore */}
        {!payload?.roles ? null : payload?.roles.includes("fsp_staff") || // @ts-ignore
          // @ts-ignore
          payload?.roles.includes("fsp_region_staff") ||
          // @ts-ignore
          payload?.roles.includes("fsp_region_head") ? (
          <Button
            onClick={() => {
              setOpenModal1(true);
            }}
          >
            <Icon
              data={
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75" clip-rule="evenodd"/></svg>'
              }
            />
          </Button>
        ) : null}
      </Flex>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Text variant="body-1">{error as string}</Text>
      ) : teams.length === 0 ? (
        <Text variant="body-1">Нет команд</Text>
      ) : (
        teams.map((item: Team) => (
          <Card width={"100%"} theme="normal" key={item.id}>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex direction="column" spacing={{ p: 3 }}>
                <Link to={`/teams/${item.id}`}>
                  <Text variant="display-1" style={{ marginBottom: ".6rem" }}>
                    {item.name}
                  </Text>
                </Link>
                <Text variant="body-2">Описание: {item.description}</Text>
                <Text variant="body-2">Капитан: {item.captain}</Text>
              </Flex>
              {/* @ts-ignore */}
              {!payload?.roles ? null : payload?.roles.includes("fsp_staff") || // @ts-ignore
                // @ts-ignore
                payload?.roles.includes("root") ||
                payload?.roles.includes("fsp_region_staff") ||
                // @ts-ignore
                payload?.roles.includes("fsp_region_head") ? (
                <Flex direction="row" gap="1" spacing={{ pr: 3 }}>
                  <Button
                    onClick={() => {
                      // @ts-ignore
                      setEditTeam(item);
                      setEditCount(item?.participants.length);
                      setOpenModal2(true);
                    }}
                    view="action"
                  >
                    <Icon
                      data={
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M11.423 1A3.577 3.577 0 0 1 15 4.577c0 .27-.108.53-.3.722l-.528.529-1.971 1.971-5.059 5.059a3 3 0 0 1-1.533.82l-2.638.528a1 1 0 0 1-1.177-1.177l.528-2.638a3 3 0 0 1 .82-1.533l5.059-5.059 2.5-2.5c.191-.191.451-.299.722-.299m-2.31 4.009-4.91 4.91a1.5 1.5 0 0 0-.41.766l-.38 1.903 1.902-.38a1.5 1.5 0 0 0 .767-.41l4.91-4.91a2.08 2.08 0 0 0-1.88-1.88m3.098.658a3.6 3.6 0 0 0-1.878-1.879l1.28-1.28c.995.09 1.788.884 1.878 1.88z" clip-rule="evenodd"/></svg>'
                      }
                    />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(item);
                    }}
                    view="action"
                  >
                    <Icon
                      data={
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M9 2H7a.5.5 0 0 0-.5.5V3h3v-.5A.5.5 0 0 0 9 2m2 1v-.5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2V3H2.251a.75.75 0 0 0 0 1.5h.312l.317 7.625A3 3 0 0 0 5.878 15h4.245a3 3 0 0 0 2.997-2.875l.318-7.625h.312a.75.75 0 0 0 0-1.5zm.936 1.5H4.064l.315 7.562A1.5 1.5 0 0 0 5.878 13.5h4.245a1.5 1.5 0 0 0 1.498-1.438zm-6.186 2v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0m3.75-.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>'
                      }
                    />
                  </Button>
                </Flex>
              ) : null}
            </Flex>
          </Card>
        ))
      )}
    </Flex>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const TeamsPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={TeamsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default TeamsPage;
