import {
  Button,
  Container,
  Flex,
  Row,
  Select,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import { RangeDatePicker } from "@gravity-ui/date-components";
import { useState } from "react";
import { useToaster } from "@gravity-ui/uikit";
import { getFileBase64 } from "shared/tools";
import PageConstr from "features/components/PageConstr";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";

interface FormData {
  title: string;
  type: string;
  discipline: string;
  start_date: string;
  end_date: string;
  description: string;
  age_group: string;
  protocol_s3_key: string;
}

export const AddEventMainContent = () => {
  const { add } = useToaster();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{
    protocol: File | null;
  }>({
    protocol: null,
  });
  const [state, setState] = useState<FormData>({
    title: "",
    type: "",
    discipline: "",
    start_date: "",
    end_date: "",
    description: "",
    age_group: "",
    protocol_s3_key: "",
  });

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

  return (
    <Container>
      <Row space="0">
        <Text variant="display-2">Добавление события</Text>
      </Row>
      <Row space="0">
        <Flex direction="column" gap="1">
          <TextInput
            value={state.title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            label="Название"
          />
          <Select
            value={[state.type]}
            onUpdate={(value) => {
              setState((prev) => {
                return { ...prev, type: value[0] };
              });
            }}
            label="Тип"
            options={[
              { value: "school", content: "Школьное мероприятие" },
              { value: "city", content: "Городское мероприятие" },
              { value: "regional", content: "Региональное мероприятие" },
              {
                value: "interregional",
                content: "Межрегиональное мероприятие",
              },
              { value: "russian", content: "Всероссийское мероприятие" },
              { value: "international", content: "Международное мероприятие" },
            ]}
          />
          <Select
            value={[state.discipline]}
            onUpdate={(value) => {
              setState((prev) => {
                return { ...prev, discipline: value[0] };
              });
            }}
            label="Дисциплина"
            options={[
              {
                value: "algorithms",
                content: "Алгоритмическое программирование",
              },
              { value: "hackathon", content: "Продуктовое программирование" },
              {
                value: "cybersecurity",
                content: "Программирование систем компьютерной безопасности",
              },
            ]}
          />
          <Select
            value={[state.age_group]}
            label="Возрастныея группы"
            multiple={false}
            options={[
              {
                value: "12-13",
                content: "юноши и девушки младшего возраста - 12-13 лет",
              },
              {
                value: "14-15",
                content: "юноши и девушки среднего возраста - 14-15 лет",
              },
              {
                value: "16-17",
                content: "юноши и девушки старшего возраста - 16-17 лет",
              },
              { value: "18-20", content: "юниоры и юниорки - 18-20 лет" },
              { value: "21-22", content: "юниоры и юниорки - 21-22 года" },
              { value: "18+", content: "мужчины и женщины - 18 лет и старше" },
            ]}
            onUpdate={(value) => {
              setState((prev) => {
                return { ...prev, age_group: value[0] };
              });
            }}
          />
          <RangeDatePicker
            onUpdate={(value) => {
              const start = value?.start.toISOString().split("T")[0] as string;
              const end = value?.end.toISOString().split("T")[0] as string;
              console.log(start, end);
              setState({
                ...state,
                start_date: start,
                end_date: end,
              });
            }}
            label="Даты проведения"
          />
          <label>
            Регламент мероприятия:{" "}
            <input name="protocol" onChange={handleFileChange} type="file" />
          </label>
          <TextInput
            value={state.description}
            label="Описание"
            onChange={(event) => {
              setState({ ...state, description: event.target.value });
            }}
          />
          <Button
            view="action"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              if (!files.protocol) {
                add({
                  theme: "danger",
                  name: "error",
                  title: "Файл не был загружен",
                  autoHiding: 5000,
                });
                return;
              }

              await uploadFileToS3(files.protocol);

              const url = "/api/events";
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(state),
              });

              if (response.ok) {
                add({
                  name: "success",
                  theme: "success",
                  title: "Мероприятие успешно создано",
                  autoHiding: 5000,
                });
                setState({
                  title: "",
                  type: "",
                  discipline: "",
                  start_date: "",
                  end_date: "",
                  description: "",
                  age_group: "",
                  protocol_s3_key: "",
                });
              } else {
                add({
                  theme: "danger",
                  name: "error",
                  title: "Мероприятие не создано",
                  autoHiding: 5000,
                });
              }
              setLoading(false);
            }}
          >
            Создать мероприятие
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
const AddEventPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={AddEventMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default AddEventPage;
