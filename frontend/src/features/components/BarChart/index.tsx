import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Регистрируем компоненты ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RegionData {
  name: string;
  count: number;
}

interface BarChartProps {
  data: RegionData[];
  title?: string;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title = "Регионы", color = "#36A2EB" }) => {
  // Сортировка данных по убыванию
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Форматирование данных для графика
  const chartData = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        label: title,
        data: sortedData.map(item => item.count),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      }
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;