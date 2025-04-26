import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

interface LineChartProps {
  data: TimeSeriesPoint[];
  title: string;
  color: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color }) => {
  // Форматируем даты для отображения
  const labels = data.map(point => {
    // Создаем объект Date из строки timestamp
    const date = new Date(point.timestamp);
    
    // Правильно обрабатываем временную зону, так как timeZone не является функцией
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(date);
  });

  const values = data.map(point => point.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        fill: false,
        backgroundColor: color,
        borderColor: color,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineChart;