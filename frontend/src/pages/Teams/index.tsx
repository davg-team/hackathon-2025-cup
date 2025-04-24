/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Flex,
  Text,
  Card,
  Loader,
  Button,
  Icon,
  Avatar,
  useToaster,
  Modal,
  TextInput,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPayload } from "shared/jwt-tools";

interface TeamMeta {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}
interface Team {
  id: string;
  name: string;
  description: string;
  captain: string;
  participants: string[];
  participants_metainfo: TeamMeta[];
}

export const TeamsMainContent = () => {
  const params = useParams<{ id: string }>();
  const { add } = useToaster();
  const token = localStorage.getItem("token");
  const payload = getPayload(token || "");

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // states for new team
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCaptain, setNewCaptain] = useState("");
  const [newParticipants, setNewParticipants] = useState(""); // comma-separated IDs
  const [isAdding, setIsAdding] = useState(false);

  // states for edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCaptain, setEditCaptain] = useState("");
  const [editParticipants, setEditParticipants] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // fetch teams
  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/teams${params.id ? `?fsp_id=${params.id}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Ошибка загрузки данных");
      const data: Team[] = await res.json();
      setTeams(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [params.id]);

  // create
  const handleAdd = async () => {
    setIsAdding(true);
    try {
      const body = {
        name: newName,
        description: newDescription,
        captain: newCaptain,
        participants: newParticipants
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 201) {
        add({ name: "", title: "Команда создана", theme: "success" });
        fetchTeams();
        setAddModalOpen(false);
        // reset
        setNewName("");
        setNewDescription("");
        setNewCaptain("");
        setNewParticipants("");
      } else {
        throw new Error("Ошибка при создании команды");
      }
    } catch (e: any) {
      add({ name: "", title: e.message, theme: "danger" });
    } finally {
      setIsAdding(false);
    }
  };

  // update
  const handleEdit = async () => {
    setIsEditing(true);
    try {
      const body = {
        name: editName,
        description: editDescription,
        captain: editCaptain,
        participants: editParticipants
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/teams/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        add({ name: "", title: "Команда обновлена", theme: "success" });
        fetchTeams();
        setEditModalOpen(false);
      } else {
        throw new Error("Ошибка при обновлении команды");
      }
    } catch (e: any) {
      add({ name: "", title: e.message, theme: "danger" });
    } finally {
      setIsEditing(false);
    }
  };

  // delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        add({ name: "", title: "Команда удалена", theme: "success" });
        fetchTeams();
      } else {
        throw new Error("Ошибка при удалении команды");
      }
    } catch (e: any) {
      add({ name: "", title: e.message, theme: "danger" });
    }
  };

  // open edit modal
  const openEdit = (team: Team) => {
    setEditId(team.id);
    setEditName(team.name);
    setEditDescription(team.description);
    setEditCaptain(team.captain);
    setEditParticipants(team.participants.join(", "));
    setEditModalOpen(true);
  };

  return (
    <Flex direction="column" width="100%" gap="1" spacing={{ m: 3 }}>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Text variant="display-2">Команды</Text>
        {payload?.roles?.some((r) =>
          ["fsp_staff", "fsp_region_staff", "fsp_region_head", "root"].includes(
            r,
          ),
        ) && (
          <Button onClick={() => setAddModalOpen(true)}>
            <Icon data="<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'><path fill='currentColor' fill-rule='evenodd' d='M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75' clip-rule='evenodd'/></svg>" />
          </Button>
        )}
      </Flex>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Text>{error}</Text>
      ) : teams.length === 0 ? (
        <Text>Нет команд</Text>
      ) : (
        teams.map((team) => (
          <Card key={team.id} width="100%" theme="normal">
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column" spacing={{ p: 3 }}>
                <Link to={`/teams/${team.id}`}>
                  <Text variant="display-1" style={{ marginBottom: "0.6rem" }}>
                    {team.name}
                  </Text>
                </Link>
                <Text>Описание: {team.description}</Text>
                <Text>Капитан: {team.captain}</Text>
                {team.participants_metainfo.length > 0 && (
                  <Flex direction="row" gap="2" wrap>
                    {team.participants_metainfo.map((p) => (
                      <Flex key={p.id} alignItems="center" gap="1">
                        <Avatar size={"l"} icon={p.avatar} />
                        <Text>
                          {p.first_name} {p.last_name}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Flex>
              {payload?.roles?.some((r) =>
                [
                  "fsp_staff",
                  "fsp_region_staff",
                  "fsp_region_head",
                  "root",
                ].includes(r),
              ) && (
                <Flex gap="1" spacing={{ pr: 3 }}>
                  <Button view="action" onClick={() => openEdit(team)}>
                    <Icon
                      data={
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M11.423 1A3.577 3.577 0 0 1 15 4.577c0 .27-.108.53-.3.722l-.528.529-1.971 1.971-5.059 5.059a3 3 0 0 1-1.533.82l-2.638.528a1 1 0 0 1-1.177-1.177l.528-2.638a3 3 0 0 1 .82-1.533l5.059-5.059 2.5-2.5c.191-.191.451-.299.722-.299m-2.31 4.009-4.91 4.91a1.5 1.5 0 0 0-.41.766l-.38 1.903 1.902-.38a1.5 1.5 0 0 0 .767-.41l4.91-4.91a2.08 2.08 0 0 0-1.88-1.88m3.098.658a3.6 3.6 0 0 0-1.878-1.879l1.28-1.28c.995.09 1.788.884 1.878 1.88z" clip-rule="evenodd"/></svg>'
                      }
                    />
                  </Button>
                  <Button view="action" onClick={() => handleDelete(team.id)}>
                    <Icon
                      data={
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M9 2H7a.5.5 0 0 0-.5.5V3h3v-.5A.5.5 0 0 0 9 2m2 1v-.5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2V3H2.251a.75.75 0 0 0 0 1.5h.312l.317 7.625A3 3 0 0 0 5.878 15h4.245a3 3 0 0 0 2.997-2.875l.318-7.625h.312a.75.75 0 0 0 0-1.5zm.936 1.5H4.064l.315 7.562A1.5 1.5 0 0 0 5.878 13.5h4.245a1.5 1.5 0 0 0 1.498-1.438zm-6.186 2v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0m3.75-.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>'
                      }
                    />
                  </Button>
                </Flex>
              )}
            </Flex>
          </Card>
        ))
      )}

      {/* Add Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Card theme="normal">
          <Flex direction="column" spacing={{ p: 3 }} gap="2">
            <Text variant="display-2">Создание команды</Text>
            <TextInput label="Название" value={newName} onUpdate={setNewName} />
            <TextInput
              label="Описание"
              value={newDescription}
              onUpdate={setNewDescription}
            />
            <TextInput
              label="Капитан (ID)"
              value={newCaptain}
              onUpdate={setNewCaptain}
            />
            <TextInput
              label="Участники (IDs, через запятую)"
              value={newParticipants}
              onUpdate={setNewParticipants}
            />
            <Button
              view="action"
              loading={isAdding}
              onClick={handleAdd}
              disabled={!newName || !newCaptain}
            >
              Сохранить
            </Button>
          </Flex>
        </Card>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Card theme="normal">
          <Flex direction="column" spacing={{ p: 3 }} gap="2">
            <Text variant="display-2">Редактирование команды</Text>
            <TextInput
              label="Название"
              value={editName}
              onUpdate={setEditName}
            />
            <TextInput
              label="Описание"
              value={editDescription}
              onUpdate={setEditDescription}
            />
            <TextInput
              label="Капитан (ID)"
              value={editCaptain}
              onUpdate={setEditCaptain}
            />
            <TextInput
              label="Участники (IDs, через запятую)"
              value={editParticipants}
              onUpdate={setEditParticipants}
            />
            <Button
              view="action"
              loading={isEditing}
              onClick={handleEdit}
              disabled={!editName || !editCaptain}
            >
              Изменить
            </Button>
          </Flex>
        </Card>
      </Modal>
    </Flex>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const TeamsPage = ({ navigation, navigation_custom }: RegionalProps) => (
  <PageConstr
    Component={TeamsMainContent}
    navigation={navigation}
    navigation_custom={navigation_custom}
  />
);

export default TeamsPage;
