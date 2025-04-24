import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  SegmentedRadioGroup,
  Select,
  Text,
  TextInput,
  useToaster,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPayload, isExpired } from "shared/jwt-tools";
import { v7 } from "uuid";

function CompetitionTeamReginster() {
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
  // const [isLoadingSend, setIsLoadingSend] = useState<boolean>(false);
  const [errorOptions, setErrorOptions] = useState<string>("");
  // const [errorSend, setErrorSend] = useState<string>("");
  const [teams, setTeams] = useState<[]>([]);
  const [type, setType] = useState<string>("old");
  const token = localStorage.getItem("token");
  const payload = getPayload(token as string);
  const [team, setTeam] = useState<any>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [isFinally, setIsFinally] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { add } = useToaster();

  useEffect(() => {
    if (!token || isExpired(token)) navigate("/logout");
  });

  useEffect(() => {
    (async function () {
      const url = "/api/teams?id=" + payload?.sub;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        setIsLoadingTeams(false);
        setErrorOptions("Не удалось загрузить команды");
      }
      setIsLoadingTeams(false);
    })();
  }, []);

  async function handleSend() {
    let data = {};
    if (type === "new") {
      data = {
        members: memberIDs,
        captain_id: payload?.sub,
        event_id: searchParams.get("event_id"),
        application_status: isFinally ? "pending" : "team",
        team_id: v7(),
        team_name: teamName,
        team_type: "temporary",
      };
    } else if (type === "old") {
      data = {
        event_id: searchParams.get("event_id"),
        application_status: "pending",
        team_id: team.id,
        team_type: "permanent",
      };
    } else if (type === "solo") {
      data = {
        members: [payload?.sub],
        captain_id: payload?.sub,
        event_id: searchParams.get("event_id"),
        application_status: "pending",
        team_id: v7(),
        team_name: teamName,
        team_type: "solo",
      };
    }

    const url = "/api/applications";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      navigate("/competitions/" + searchParams.get("event_id"));
      add({
        name: "success",
        theme: "success",
        title: "Заявка успешно создана",
        autoHiding: 5000,
      });
    } else {
      add({
        name: "success",
        theme: "danger",
        title: "Не удалось подать заявку, попробуйте позже.",
        autoHiding: 5000,
      });
    }
  }

  function handleMemberCountChange(value: string) {
    const count = parseInt(value, 10) || 0;
    setMemberCount(count);
    setMemberIDs(new Array(count).fill(""));
  }

  function handleMemberIDChange(index: number, value: string) {
    const updatedIDs = [...memberIDs];
    updatedIDs[index] = value;
    setMemberIDs(updatedIDs);
  }

  return (
    <Container>
      <Flex direction={"column"} gap={"4"}>
        <Text variant="display-2">Регистрация команды на соревнование</Text>
        <Card view="raised" spacing={{ p: "10" }}>
          <Text variant="display-1">
            Выберите существующую или создайте новую команды
          </Text>
          <br />
          <br />
          <SegmentedRadioGroup
            defaultValue="old"
            onChange={(event) => {
              setType(event.target.value);
            }}
            options={[
              { value: "old", content: "Выбрать команду" },
              { value: "new", content: "Создать команду" },
              { value: "solo", content: "Сольное участие" },
            ]}
          />
          <br />
          <br />
          {type === "new" ? (
            <>
              <Text variant={"subheader-3"}>
                Для регистрации укажите название команды, количество членов
                команды и укажите ID каждого из них.
              </Text>
              <br />
              <Text variant={"subheader-3"}>
                ID можно скопировать в{" "}
                <a target="_blank" href={"/lk"}>
                  профиле
                </a>{" "}
                спортсмена.
              </Text>
              <br />
              <br />
              <TextInput
                placeholder="Название команды"
                value={teamName}
                onUpdate={(value) => setTeamName(value)}
              />
              <br />
              <br />
              <TextInput
                type="number"
                placeholder="Количество участников"
                value={memberCount.toString()}
                onUpdate={handleMemberCountChange}
              />
              <br />
              <br />
              {memberIDs.map((id, index) => (
                <>
                  <TextInput
                    key={index}
                    placeholder={`ID участника ${index + 1}`}
                    value={id}
                    onUpdate={(value) => handleMemberIDChange(index, value)}
                  />
                  <br />
                  <br />
                </>
              ))}
              <Checkbox
                onChange={(event) => {
                  setIsFinally(event.target.checked);
                }}
              >
                Завершили формировать команду
              </Checkbox>
            </>
          ) : type === "old" ? (
            <Select
              onUpdate={(value) => {
                setTeam(value[0]);
              }}
              errorMessage={errorOptions}
              loading={isLoadingTeams}
              options={teams.map((team) => ({
                value: team,
                //@ts-ignore
                content: team.name,
              }))}
              size="l"
              placeholder={"Выберите существующую команду"}
            ></Select>
          ) : (
            <>
              <Text variant="subheader-3">
                Для сольного участия необходимо указать название команды
              </Text>
              <br />
              <br />
              <TextInput
                placeholder="Название команды"
                value={teamName}
                onUpdate={(value) => setTeamName(value)}
              />
            </>
          )}
          <br />
          <br />
          <Button onClick={handleSend} size="l" view={"action"}>
            Зарегистрироваться
          </Button>
        </Card>
      </Flex>
    </Container>
  );
}
interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const CompetitionTeamReginsterPage = ({
  navigation,
  navigation_custom,
}: RegionalProps) => {
  return (
    <PageConstr
      Component={CompetitionTeamReginster}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default CompetitionTeamReginsterPage;
