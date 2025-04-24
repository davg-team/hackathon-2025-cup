import {
  Button,
  Container,
  Flex,
  Row,
  Select,
  Text,
  TextInput,
  Switch,
  NumberInput,
  TextArea,
} from "@gravity-ui/uikit";
import { RangeDatePicker } from "@gravity-ui/date-components";
import { useState } from "react";
import { useToaster } from "@gravity-ui/uikit";
import { data, disciplines, types } from "shared/data";

interface FormData {
  title: string;
  type: string;
  discipline: string;
  start_date: string;
  end_date: string;
  description: string;
  age_group: string;
  protocol_s3_key: string;
  event_image_s3_key: string;
  is_open: boolean;
  status: string;
  regions: string[];
  stages: string[];
  min_age: number;
  max_age: number;
  min_people: number;
  max_people: number;
}

export const AddEventMainContent = () => {
  const { add } = useToaster();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{
    protocol: File | null;
    image: File | null;
  }>({
    protocol: null,
    image: null,
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
    event_image_s3_key: "",
    is_open: false,
    status: "",
    regions: [],
    stages: [],
    min_age: 0,
    max_age: 0,
    min_people: 0,
    max_people: 0,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prev) => ({
      ...prev,
      [event.target.name]: event.target.files?.[0] || null,
    }));
  };

  const uploadFileToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const reportResponse = await fetch("/api/files/upload", {
      method: "PUT",
      body: formData,
    });

    if (!reportResponse.ok) return null;
    const data = await reportResponse.json();
    return data.id;
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
            onUpdate={(value) => setState({ ...state, type: value[0] })}
            label="Тип"
            options={types}
          />
          <Select
            value={[state.discipline]}
            onUpdate={(value) => setState({ ...state, discipline: value[0] })}
            label="Дисциплина"
            options={disciplines}
          />
          <Select
            value={state.regions}
            multiple
            label="Регионы"
            options={data}
            onUpdate={(value) => setState({ ...state, regions: value })}
          />
          <TextArea
            placeholder="Этапы (по одному на строку, формат: 13.04-14.04 - Название)"
            value={state.stages.join("\n")}
            onChange={(e) =>
              setState({ ...state, stages: e.target.value.split("\n") })
            }
          />
          <Select
            value={[state.age_group]}
            label="Возрастные группы"
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
            onUpdate={(value) => setState({ ...state, age_group: value[0] })}
          />
          <RangeDatePicker
            onUpdate={(value) => {
              const start = value?.start.toISOString().split("T")[0] ?? "";
              const end = value?.end.toISOString().split("T")[0] ?? "";
              setState({ ...state, start_date: start, end_date: end });
            }}
            label="Даты проведения"
          />
          <Switch
            checked={state.is_open}
            onUpdate={(value) => setState({ ...state, is_open: value })}
          >
            Открытое мероприятие
          </Switch>
          <TextInput
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            label="Описание"
          />
          <label>
            Регламент мероприятия:
            <input name="protocol" onChange={handleFileChange} type="file" />
          </label>
          <label>
            Изображение мероприятия:
            <input name="image" onChange={handleFileChange} type="file" />
          </label>
          <Flex gap="2">
            <NumberInput
              value={state.min_age}
              // @ts-ignore
              onUpdate={(val) => setState({ ...state, min_age: val })}
              label="Минимальный возраст"
            />
            <NumberInput
              value={state.max_age}
              // @ts-ignore
              onUpdate={(val) => setState({ ...state, max_age: val })}
              label="Максимальный возраст"
            />
          </Flex>
          <Flex gap="2">
            <NumberInput
              value={state.min_people}
              // @ts-ignore
              onUpdate={(val) => setState({ ...state, min_people: val })}
              label="Мин. участников"
            />
            <NumberInput
              value={state.max_people}
              // @ts-ignore
              onUpdate={(val) => setState({ ...state, max_people: val })}
              label="Макс. участников"
            />
          </Flex>

          <Button
            view="action"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              if (!files.protocol || !files.image) {
                add({
                  theme: "danger",
                  name: "error",
                  title: "Загрузите оба файла",
                  autoHiding: 5000,
                });
                setLoading(false);
                return;
              }

              const protocolId = await uploadFileToS3(files.protocol);
              const imageId = await uploadFileToS3(files.image);

              if (protocolId && imageId) {
                const fullData = {
                  ...state,
                  protocol_s3_key: protocolId,
                  event_image_s3_key: imageId,
                };

                const response = await fetch("/api/events", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(fullData),
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
                    event_image_s3_key: "",
                    is_open: false,
                    status: "",
                    regions: [],
                    stages: [],
                    min_age: 0,
                    max_age: 0,
                    min_people: 0,
                    max_people: 0,
                  });
                } else {
                  add({
                    theme: "danger",
                    name: "error",
                    title: "Мероприятие не создано",
                    autoHiding: 5000,
                  });
                }
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
