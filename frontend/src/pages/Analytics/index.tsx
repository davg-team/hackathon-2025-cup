import { useEffect, useState, useMemo } from "react";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import {
  Button,
  Card,
  Col,
  Container,
  Flex,
  Icon,
  Loader,
  Row,
  Select,
//   Tab,
  Text,
} from "@gravity-ui/uikit";
import { 
  Calendar, 
  ChartPie, 
  ArrowDown, 
//   FileArrowDown, 
  Persons 
} from "@gravity-ui/icons";
// import { DatePicker } from "@gravity-ui/date-components";
import PageConstr from "features/components/PageConstr";
import StatCard from "features/components/StatCard";
import LineChart from "features/components/LineChart";
import BarChart from "features/components/BarChart";
import { data as regionsData } from "shared/data";

// Типы данных для API
interface SummaryData {
  total_users: number;
  new_users: number;
  total_events: number;
  events_last_30d: number;
  total_applications: number;
  applications_last_30d: number;
}

interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

interface TimeSeriesData {
  series: TimeSeriesPoint[];
}

interface RegionData {
  name: string;
  count: number;
}

interface TopRegionsData {
  regions: RegionData[];
}

const metricOptions = [
  { value: "events", content: "Мероприятия" },
  { value: "applications", content: "Заявки" },
  { value: "users", content: "Пользователи" },
];

// const typeOptions = [
//   { value: "regions", content: "Регионы" },
// //   { value: "new", content: "Новые" },
// ];

const regionsOptions = regionsData.map((region) => ({
  value: region.value,
  content: region.content,
}));

export const AnalyticsMainContent = () => {
  // Состояния для фильтров
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [selectedRegion, setSelectedRegion] = useState<string>("0");
  const [selectedMetric, setSelectedMetric] = useState<string>("users");
  const [selectedType] = useState<string>("total"); //@ts-ignore
  const [dateRange, setDateRange] = useState<[Date, Date]>([ //@ts-ignore
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);

  // Состояния для данных
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesPoint[]>([]);
  const [topRegionsData, setTopRegionsData] = useState<RegionData[]>([]);

  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [isLoadingTimeSeries, setIsLoadingTimeSeries] = useState<boolean>(false);
  const [isLoadingTopRegions, setIsLoadingTopRegions] = useState<boolean>(false);

  // Загрузка общих данных
  useEffect(() => {
    if (activeTab !== "summary") return;

    const fetchSummaryData = async () => {
      setIsLoadingSummary(true);
      try {
        const response = await fetch(
          `/api/analytics/summary${selectedRegion !== "0" ? `?region=${selectedRegion}` : ""}`
        );
        if (response.ok) {
          const data = await response.json();
          setSummaryData(data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке общих данных:", error);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchSummaryData();
  }, [activeTab, selectedRegion]);

  // Загрузка временных рядов
  useEffect(() => {
    if (activeTab !== "time-series") return;

    const fetchTimeSeriesData = async () => {
      setIsLoadingTimeSeries(true);
      try {
        const startDate = dateRange[0].toISOString().split('T')[0];
        const endDate = dateRange[1].toISOString().split('T')[0];
        
        const response = await fetch(
          `/api/analytics/time-series?metric=${selectedMetric}&start=${startDate}&end=${endDate}${selectedRegion !== "0" ? `&region=${selectedRegion}` : ""}`
        );
        
        if (response.ok) {
          const data: TimeSeriesData = await response.json();
          setTimeSeriesData(data.series || []);
        }
      } catch (error) {
        console.error("Ошибка при загрузке временных рядов:", error);
      } finally {
        setIsLoadingTimeSeries(false);
      }
    };

    fetchTimeSeriesData();
  }, [activeTab, selectedMetric, selectedRegion, dateRange]);

  // Загрузка топ регионов
  useEffect(() => {
    if (activeTab !== "top-regions") return;

    const fetchTopRegionsData = async () => {
      setIsLoadingTopRegions(true);
      try {
        const response = await fetch(
          `/api/analytics/top?type=regions&metric=${selectedMetric}&limit=10`
        );
        
        if (response.ok) {
          const data: TopRegionsData = await response.json();
          setTopRegionsData(data.regions || []);
        }
      } catch (error) {
        console.error("Ошибка при загрузке топ регионов:", error);
      } finally {
        setIsLoadingTopRegions(false);
      }
    };

    fetchTopRegionsData();
  }, [activeTab, selectedType, selectedMetric]);

  // Форматирование названий регионов для отображения
  const formattedTopRegionsData = useMemo(() => {
    return topRegionsData.map(region => {
      const regionData = regionsData.find(r => r.value === region.name);
      return {
        ...region,
        name: regionData ? regionData.content : region.name,
      };
    });
  }, [topRegionsData]);

  // Получить URL для скачивания данных
  const getDownloadUrl = () => {
    if (activeTab === "time-series") {
      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];
      return `/api/analytics/time-series?metric=${selectedMetric}&start=${startDate}&end=${endDate}${selectedRegion !== "0" ? `&region=${selectedRegion}` : ""}`;
    } else if (activeTab === "top-regions") {
      return `/api/analytics/top?type=${selectedType}&metric=${selectedMetric}&limit=10`;
    } else {
      return `/api/analytics/summary${selectedRegion !== "0" ? `?region=${selectedRegion}` : ""}`;
    }
  };

  // Вкладки для навигации
  const tabs = [
    { id: "summary", title: "Обзор" },
    { id: "time-series", title: "Временные ряды" },
    { id: "top-regions", title: "Топ регионов" },
  ];

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Text variant="display-1">Аналитика</Text>

        <Flex gap="2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              view={activeTab === tab.id ? "action" : "normal"}
              size="l"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </Button>
          ))}
        </Flex>

        {/* Фильтры для всех разделов */}
        <Card view="outlined" style={{ padding: "16px" }}>
          <Flex gap="2" alignItems="center">
            <Select
              placeholder="Выберите регион"
              label="Регион"
              value={[selectedRegion]}
              onUpdate={(value) => setSelectedRegion(value[0])}
              options={[{ value: "0", content: "Все регионы" }, ...regionsOptions]}
              width="max"
            />

            {activeTab === "time-series" && (
              <>
                <Select
                  placeholder="Выберите метрику"
                  label="Метрика"
                  value={[selectedMetric]}
                  onUpdate={(value) => setSelectedMetric(value[0])}
                  options={metricOptions}
                />
                {/* <DatePicker
                  label="Период"
                  type="date-range"
                  value={dateRange}
                  onUpdate={(value) => {
                    const adjustedValue = (value as [Date, Date]).map(date => {
                      const offset = date.getTimezoneOffset();
                      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
                      return adjustedDate;
                    }) as [Date, Date];
                    setDateRange(adjustedValue);
                  }}
                  style={{ width: "300px" }}
                /> */}
              </>
            )}

            {activeTab === "top-regions" && (
              <>
                <Select
                  placeholder="Выберите метрику"
                  label="Метрика"
                  value={[selectedMetric]}
                  onUpdate={(value) => setSelectedMetric(value[0])}
                  options={metricOptions}
                />
              </>
            )}
          </Flex>
        </Card>

        {/* Содержимое вкладки "Обзор" */}
        {activeTab === "summary" && (
          <div>
            {isLoadingSummary ? (
              <Flex justifyContent="center" style={{ padding: "16px" }}>
                <Loader size="l" />
              </Flex>
            ) : (
              summaryData && (
                <>
                  <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: "3rem" }}>
                    <Text variant="subheader-2">Общая статистика</Text>
                    <a href={getDownloadUrl()} download>
                      <Button view="outlined" size="m">
                        <Icon data={ArrowDown} />
                        Скачать статистику
                      </Button>
                    </a>
                  </Flex>
                  <Row space="4">
                    <Col s="12" m="6" l="4">
                      <StatCard
                        title="Всего пользователей"
                        value={summaryData.total_users}
                        icon={Persons}
                        color="#36A2EB"
                        subValue={summaryData.new_users}
                        subText="новых за месяц"
                      />
                    </Col>
                    <Col s="12" m="6" l="4">
                      <StatCard
                        title="Всего мероприятий"
                        value={summaryData.total_events}
                        icon={Calendar}
                        color="#FF6384"
                        subValue={summaryData.events_last_30d}
                        subText="за последние 30 дней"
                      />
                    </Col>
                    <Col s="12" m="6" l="4">
                      <StatCard
                        title="Всего заявок"
                        value={summaryData.total_applications}
                        icon={ChartPie}
                        color="#FFCE56"
                        subValue={summaryData.applications_last_30d}
                        subText="за последние 30 дней"
                      />
                    </Col>
                  </Row>
                </>
              )
            )}
          </div>
        )}

        {/* Содержимое вкладки "Временные ряды" */}
        {activeTab === "time-series" && (
          <div>
            {isLoadingTimeSeries ? (
              <Flex justifyContent="center" style={{ padding: "16px" }}>
                <Loader size="l" />
              </Flex>
            ) : (
              <Card view="outlined" style={{ padding: "16px" }}>
                <Flex direction="column" gap="2">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text variant="subheader-2">
                      Динамика изменения {selectedMetric === "users" ? "пользователей" : 
                                          selectedMetric === "events" ? "мероприятий" : "заявок"}
                    </Text>
                    <a href={getDownloadUrl()} download>
                      <Button view="outlined" size="m">
                        <Icon data={ArrowDown} />
                        Скачать статистику
                      </Button>
                    </a>
                  </Flex>
                  {timeSeriesData.length > 0 ? (
                    <LineChart 
                      data={timeSeriesData} 
                      title={selectedMetric === "users" ? "Пользователи" : 
                             selectedMetric === "events" ? "Мероприятия" : "Заявки"}
                      color={selectedMetric === "users" ? "#36A2EB" : 
                             selectedMetric === "events" ? "#FF6384" : "#FFCE56"}
                    />
                  ) : (
                    <Flex justifyContent="center" style={{ padding: "6px" }}>
                      <Text variant="body-2">Нет данных для отображения</Text>
                    </Flex>
                  )}
                </Flex>
              </Card>
            )}
          </div>
        )}

        {/* Содержимое вкладки "Топ регионов" */}
        {activeTab === "top-regions" && (
          <div>
            {isLoadingTopRegions ? (
              <Flex justifyContent="center" style={{ padding: "16px" }}>
                <Loader size="l" />
              </Flex>
            ) : (
              <Card view="outlined" style={{ padding: "16px" }}>
                <Flex direction="column" gap="2">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text variant="subheader-2">
                      Топ-10 регионов: {selectedType === "total" ? "Всего" : "Новых"} {" "}
                      {selectedMetric === "users" ? "пользователей" : 
                       selectedMetric === "events" ? "мероприятий" : "заявок"}
                    </Text>
                    <a href={getDownloadUrl()} download>
                      <Button view="outlined" size="m">
                        <Icon data={ArrowDown} />
                        Скачать статистику
                      </Button>
                    </a>
                  </Flex>
                  {formattedTopRegionsData.length > 0 ? (
                    <BarChart 
                      data={formattedTopRegionsData} 
                      title={`${selectedType === "total" ? "Всего" : "Новых"} ${
                        selectedMetric === "users" ? "пользователей" : 
                        selectedMetric === "events" ? "мероприятий" : "заявок"
                      }`}
                      color={selectedMetric === "users" ? "#36A2EB" : 
                             selectedMetric === "events" ? "#FF6384" : "#FFCE56"}
                    />
                  ) : (
                    <Flex justifyContent="center" style={{ padding: "16px" }}>
                      <Text variant="body-2">Нет данных для отображения</Text>
                    </Flex>
                  )}
                </Flex>
              </Card>
            )}
          </div>
        )}
      </Flex>
    </Container>
  );
};

interface AnalyticsPageProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

const AnalyticsPage = ({ navigation, navigation_custom }: AnalyticsPageProps) => {
  return (
    <PageConstr
      Component={AnalyticsMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default AnalyticsPage;