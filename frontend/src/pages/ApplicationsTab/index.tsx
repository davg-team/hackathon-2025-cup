import { Button, Text, Card, Flex, Loader } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import { getPayload } from "shared/jwt-tools";
interface IData {
  application_id: string;
  event_id: string;
  event_date: string; // ISO 8601 format, можно заменить на `Date`, если планируется парсинг
  application_status: "pending" | "approved" | "rejected"; // можно добавить другие статусы, если они есть
  team_id: string;
  team_name: string;
  captain_id: string;
  team_type: "solo" | "duo" | "squad"; // предполагаемые типы, расширь при необходимости
  created_at: string; // тоже ISO 8601
  members: string[];
}

function ApplicationCard({
  data,
  fetchTeams,
}: {
  data: IData;
  fetchTeams: () => void;
}) {
  const token = localStorage.getItem("token");

  async function approve() {
    const url =
      "/api/applications/" + data.application_id + "/status?status=approved";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) {
      fetchTeams();
    }
  }
  async function decline() {
    const url =
      "/api/applications/" + data.application_id + "/status?status=rejected";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) {
      fetchTeams();
    }
  }
  return (
    <Card spacing={{ p: "3" }} view="raised" width={"100%"}>
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex gap={"2"} width={"60%"}>
          <Flex direction={"column"}>
            <Text variant="display-1">{data.team_name}</Text>
            <Text variant="subheader-3">Капитан: {data.captain_id}</Text>
          </Flex>
        </Flex>
        <Flex gap={"2"}>
          <Button
            view="action"
            onClick={() => {
              approve();
            }}
          >
            Принять
          </Button>
          <Button
            onClick={() => {
              decline();
            }}
            view="outlined-action"
          >
            Отколнить
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

function ApplicationsTab() {
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  async function fetchTeams() {
    setIsLoadingTeams(true);
    const url = "/api/applications?status=pending&fsp_id=" + payload?.region_id;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTeams(data);
    } else {
      setError("Не удалось получить заявки на участие");
    }
    setIsLoadingTeams(false);
  }

  useEffect(() => {
    fetchTeams();
  }, []);
  return (
    <Flex width={"100%"} direction={"column"} gap={"2"}>
      <br />
      <br />
      {isLoadingTeams ? (
        <Loader />
      ) : error ? (
        <Text variant="display-1"></Text>
      ) : teams.length > 0 ? (
        teams.map((item, id) => (
          <ApplicationCard fetchTeams={fetchTeams} key={id} data={item} />
        ))
      ) : (
        <Text variant="display-1">Нет заявок</Text>
      )}
    </Flex>
  );
}

export default ApplicationsTab;
