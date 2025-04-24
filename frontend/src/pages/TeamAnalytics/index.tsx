/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Flex, Loader, Select, Text } from "@gravity-ui/uikit";
import { useParams } from "react-router-dom";
import { disciplines } from "shared/data";
import Chart from "features/components/Chart";

interface TeamAnalyticsProps {
  algorithm_count: number;
  hackathon_count: number;
  cyber_security_count: number;
  city_events_count: number;
  regional_events_count: number;
  russian_events_count: number;
  first_place_count: number;
  second_place_count: number;
  third_place_count: number;
}

const filtersTypes = {
  "": "",
  event_discipline: "Дисциплина",
  event_type: "Тип мероприятия",
  placement: "Место",
};

const TeamAnalytics = () => {
  const params = useParams();
  const [data, setData] = useState<TeamAnalyticsProps>({
    algorithm_count: 0,
    hackathon_count: 0,
    cyber_security_count: 0,
    city_events_count: 0,
    regional_events_count: 0,
    russian_events_count: 0,
    first_place_count: 0,
    second_place_count: 0,
    third_place_count: 0,
  });
  const [filters, setFilters] = useState<keyof typeof filtersTypes>("");
  const [currentFilter, setCurrentFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getTeamAnalytics() {
    setLoading(true);
    const url = `/api/analytics/stats/${params.id}${
      "?" + filters + "=" + currentFilter
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setData({
        algorithm_count: data.algorithm_count,
        hackathon_count: data.hackathon_count,
        cyber_security_count: data.cyber_security_count,
        city_events_count: data.city_events_count,
        regional_events_count: data.regional_events_count,
        russian_events_count: data.russian_events_count,
        first_place_count: data.first_place_count,
        second_place_count: data.second_place_count,
        third_place_count: data.third_place_count,
      });
      setLoading(false);
    } else {
      setError(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getTeamAnalytics();
  }, []);

  useEffect(() => {
    if (
      (currentFilter && filters) ||
      (filters === "" && currentFilter === "")
    ) {
      setLoading(true);
      getTeamAnalytics();
      setLoading(false);
    }
  }, [currentFilter, filters]);

  return (
    <Flex gap="1" direction="column">
      <Text variant="display-2">Аналитика команды</Text>
      <Flex>
        <Flex direction="column" width="100%" gap="1">
          <Select
            label="Фильтры"
            options={[
              { value: "", content: "Все" },
              { value: "event_discipline", content: "Дисциплина" },
              { value: "event_type", content: "Тип мероприятия" },
              { value: "placement", content: "Место" },
            ]}
            onUpdate={(value) => {
              setFilters(value[0] as keyof typeof filtersTypes);
              setCurrentFilter("");
            }}
          />
          {filters !== "" && (
            <Select
              label="Параметр фильтрации"
              options={
                filters === "placement"
                  ? [
                      { value: "1", content: "1 место" },
                      { value: "2", content: "2 место" },
                      { value: "3", content: "3 место" },
                    ]
                  : filters === "event_discipline"
                    ? disciplines
                    : filters === "event_type"
                      ? [
                          { value: "city", content: "Городское" },
                          { value: "regional", content: "Региональное" },
                          { value: "russian", content: "Всероссийское" },
                        ]
                      : []
              }
              onUpdate={(value) =>
                setCurrentFilter(value[0] as keyof typeof filtersTypes)
              }
            />
          )}
          {loading ? (
            <Loader />
          ) : (
            <>
              <Text variant="display-1">Дисциплина</Text>
              <Chart type="event_discipline" data={data} />
              <Text variant="display-1">Тип мероприятия</Text>
              <Chart type="event_type" data={data} />
              <Text variant="display-1">Место</Text>
              <Chart type="placement" data={data} />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TeamAnalytics;
