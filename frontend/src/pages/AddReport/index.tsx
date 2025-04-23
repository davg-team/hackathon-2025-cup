/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Container,
  Text,
  TextInput,
  Flex,
  Row,
  Select,
  Button,
  useToaster,
} from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileBase64 } from "shared/tools";

interface Event {
  id: string;
  title: string;
  description: string;
  type:
    | "school"
    | "city"
    | "regional"
    | "interregional"
    | "russian"
    | "international";
  status: "on_verification" | "verified" | "declined";
  discipline: "algorithms" | "hackathon" | "cybersecurity";
  start_date: string;
  end_date: string;
}

interface FormData {
  competition_id: string;
  winners_count: number;
  protocol_s3_key: string;
  teams: {
    team_id: string;
    placement: number;
  }[];
}

interface PreparedEvent {
  value: Event["id"];
  content: string;
}

export const AddReportMainContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
  const [teams, setTeams] = useState([]);
  const [files, setFiles] = useState<{
    protocol: File | null;
  }>({
    protocol: null,
  });
  const [preparedEvents, setPreparedEvents] = useState<PreparedEvent[]>([]);
  const [state, setState] = useState<FormData>({
    competition_id: "",
    winners_count: 0,
    protocol_s3_key: "",
    teams: [],
  });
  const params = useParams();
  const { add } = useToaster();

  async function fetchTeams() {
    const token = localStorage.getItem("token");
    setIsLoadingTeams(true);
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
      setIsLoadingTeams(false);
    } else {
      setIsLoadingTeams(false);
      add({
        theme: "danger",
        name: "error",
        title: "Произошла ошибка при загрузке команд",
        autoHiding: 5000,
      });
    }

    setIsLoading(false);
  }

  async function fetchEvents() {
    setIsLoading(true);
    const url = `/api/events?status=verified&organization_id=${params.id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      setEvents(data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  useEffect(() => {
    setPreparedEvents(
      events.map((event: Event) => ({
        value: event.id,
        content: event.title,
      })),
    );
  }, [events]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prev) => ({
      ...prev,
      [event.target.name]: event.target.files?.[0] || null,
    }));
  };

  const uploadFileToS3 = async (file: File) => {
    const reportResponse = await fetch("/api/aws_sign_s3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: file.name,
        file_content: await getFileBase64(file),
      }),
    });

    if (!reportResponse.ok) {
      return false;
    } else {
      return true;
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    if (!files.protocol) {
      add({
        theme: "danger",
        name: "error",
        title: "Вы не загрузили файл",
        autoHiding: 5000,
      });
      setIsLoading(false);
      return;
    }

    const protocolKey = await uploadFileToS3(files.protocol);
    if (!protocolKey) {
      add({
        theme: "danger",
        name: "error",
        title: "Произошла ошибка при загрузке файлов",
        autoHiding: 5000,
      });
      setIsLoading(false);
      return;
    }

    setState({
      ...state,
      protocol_s3_key: files.protocol.name,
    });
    await fetch("/api/reports/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...state,
        protocol_s3_key: files.protocol.name,
        winners_count: Number(state.winners_count),
      }),
    });
    add({
      theme: "success",
      name: "success",
      title: "Отчет успешно создан",
      autoHiding: 5000,
    });
    setState({
      competition_id: "",
      winners_count: 0,
      protocol_s3_key: "",
      teams: [],
    });
    setIsLoading(false);
  };

  // @ts-ignore
  const handleSelectChange = (index, value) => {
    const newInputs = [...state.teams];
    newInputs[index] = {
      team_id: value[0],
      placement: index + 1,
    };
    setState({ ...state, teams: newInputs });
  };

  function getEventByID(id: string) {
    return events.find((event) => event.id === id);
  }

  return (
    <Container>
      <Row space="0">
        <Text variant="display-2">Добавление отчет</Text>
      </Row>
      <Row space="0">
        <Flex direction="column" gap="1" width="100%">
          <Select
            value={[state.competition_id]}
            loading={isLoading}
            onUpdate={(value) =>
              setState({ ...state, competition_id: value[0] })
            }
            label="Выберите мероприятие:"
            options={preparedEvents}
          />
          <TextInput
            value={state.winners_count.toString()}
            onChange={(e) =>
              setState({ ...state, winners_count: Number(e.target.value) })
            }
            type="number"
            label="Количество победителей:"
          />
          <Text variant="display-1">Команды</Text>

          {Array.from({ length: Number(state.winners_count) }).map(
            (_, index) => (
              <>
                <Select
                  value={[state.teams[index]?.team_id]}
                  key={index}
                  label={`${index + 1} место:`}
                  loading={isLoadingTeams}
                  options={teams.map((team) => ({
                    // @ts-ignore
                    value: team.id,
                    // @ts-ignore
                    content: team.name,
                  }))}
                  onUpdate={(value) => handleSelectChange(index, value)}
                />
                {/* /api/auth/generate_certificate/?name=NAME&place=PLACE место&event=EVENT&date=DATE */}
                <a
                  download
                  href={`/api/auth/generate_certificate/?name=${
                    // @ts-ignore
                    teams[index]?.name
                  }&place=${index + 1} место&event=${
                    getEventByID(state.competition_id)?.title
                  }&date=${
                    getEventByID(state.competition_id)?.end_date.split("T")[0]
                  }`}
                >
                  Скачать сертификат
                </a>
              </>
            ),
          )}
          <label>
            Протокол мероприятия:{" "}
            <input name="protocol" onChange={handleFileChange} type="file" />
          </label>
          <Button loading={isLoading} onClick={handleUpload}>
            Отправить
          </Button>
        </Flex>
      </Row>
    </Container>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const AddReportPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={AddReportMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default AddReportPage;
