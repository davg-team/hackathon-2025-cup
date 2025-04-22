/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  algorithm_count: number;
  hackathon_count: number;
  cyber_security_count: number;

  first_place_count: number;
  second_place_count: number;
  third_place_count: number;

  city_events_count: number;
  regional_events_count: number;
  russian_events_count: number;
}

// @ts-ignore
const Chart = ({
  data,
  type,
}: {
  data: ChartData;
  type: "event_discipline" | "event_type" | "placement";
}) => {
  const chartData = {
    // labels: [
    //   "Алгоритмы",
    //   "Хакатоны",
    //   "Кибербезопасность",
    //   "1 место",
    //   "2 место",
    //   "3 место",
    //   "Городские",
    //   "Региональные",
    //   "Всероссийские",
    // ],
    labels:
      type === "event_discipline"
        ? ["Алгоритмы", "Хакатоны", "Кибербезопасность"]
        : type === "event_type"
        ? ["Городские", "Региональные", "Всероссийские"]
        : ["1 место", "2 место", "3 место"],
    datasets: [
      {
        label: "Количество мероприятий",
        // data: [
        //   data?.algorithm_count || 0,
        //   data?.hackathon_count || 0,
        //   data?.cyber_security_count || 0,
        //   data?.first_place_count || 0,
        //   data?.second_place_count || 0,
        //   data?.third_place_count || 0,
        //   data?.city_events_count || 0,
        //   data?.regional_events_count || 0,
        //   data?.russian_events_count || 0,
        // ],
        data:
          type === "event_discipline"
            ? [
                data?.algorithm_count || 0,
                data?.hackathon_count || 0,
                data?.cyber_security_count || 0,
              ]
            : type === "event_type"
            ? [
                data?.city_events_count || 0,
                data?.regional_events_count || 0,
                data?.russian_events_count || 0,
              ]
            : [
                data?.first_place_count || 0,
                data?.second_place_count || 0,
                data?.third_place_count || 0,
              ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
      },
    ],
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Pie data={chartData} />
    </div>
  );
};

export default Chart;
