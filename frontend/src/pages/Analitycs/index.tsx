import { Flex, Loader, Select, Table, Text } from "@gravity-ui/uikit";
import { useEffect, useState } from "react";

const columns = [
  { id: "код региона" },
  { id: "название" },
  { id: "мероприятий" },
  { id: "алгоритмическое" },
  { id: "продуктовое" },
  { id: "инфобез" },
  { id: "побед в алгоритмических" },
  { id: "побед в продуктовых" },
  { id: "побед в инфобез" },
];

interface Region {
  id: string;
  name: string;
  events_count: number;
  algorithm_count: number;
  hackathon_count: number;
  cyber_security_count: number;
  algorithm_winners_count: number;
  hackathon_winners_count: number;
  cyber_security_winners_count: number;
}

interface PreparedData {
  "код региона": string;
  название: string;
  мероприятий: number;
  алгоритмическое: number;
  продуктовое: number;
  инфобез: number;
  "побед в алгоритмических": number;
  "побед в продуктовых": number;
  "побед в инфобез": number;
}

const Analitycs = () => {
  const [state, setState] = useState({
    filter: "winners",
  });
  const [data, setData] = useState<Region[]>([]);
  const [preparedData, setPreparedData] = useState<PreparedData[]>([]);

  useEffect(() => {
    async function request() {
      const url = "/api/analytics/regions?filter=" + state.filter;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        setData([]);
      }
    }

    request();
  }, [state.filter]);

  useEffect(() => {
    setPreparedData(
      data.map((item: Region) => {
        return {
          "код региона": item.id,
          название: item.name,
          мероприятий: item.events_count,
          алгоритмическое: item.algorithm_count,
          продуктовое: item.hackathon_count,
          инфобез: item.cyber_security_count,
          "побед в алгоритмических": item.algorithm_winners_count,
          "побед в продуктовых": item.hackathon_winners_count,
          "побед в инфобез": item.cyber_security_winners_count,
        };
      })
    );
  }, [data]);

  return (
    <Flex direction="column">
      <Flex gap="1" alignItems="center">
        <Text variant="display-1">Топ регионов</Text>
        <Select
          onUpdate={(value) => {
            setData([]);
            setState({ ...state, filter: value[0] });
          }}
          label="Фильтр"
          defaultValue={[state.filter]}
          options={[
            { value: "winners", content: "по победителям" },
            { value: "events", content: "по количеству соревнований" },
          ]}

        ></Select>
      </Flex>
      <Flex>
        {data.length > 0 ? (
          <Table columns={columns} data={preparedData}></Table>
        ) : (
          <Loader />
        )}
      </Flex>
    </Flex>
  );
};

export default Analitycs;
