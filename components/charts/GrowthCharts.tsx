"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function GrowthCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#3e4946',
          font: { family: 'Inter', size: 12 },
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6e7976', font: { family: 'Inter', size: 11 } }
      },
      y: {
        border: { display: false },
        grid: { color: '#ebefec' },
        ticks: { color: '#6e7976', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Clients',
        data: [100, 150, 200, 250, 400, 600, 700, 800, 900, 1000, 1100, 1200],
        borderColor: '#29685e',
        backgroundColor: '#afefe2',
        tension: 0.4,
      }
    ],
  };

  const agenciesGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Agencies',
        data: [12, 19, 3, 5, 10, 20, 30, 40, 50, 60, 70, 80],
        backgroundColor: '#004e45',
        borderRadius: 4,
      }
    ]
  };

  const earningGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue ($K)',
        data: [45, 52, 68, 74, 90, 124, 150, 180, 210, 240, 270, 300],
        borderColor: '#066a5f',
        backgroundColor: '#a1f2e3',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">User Growth</h3>
        <div className="flex-1 min-h-[250px]">
          <Bar data={userGrowthData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">Agencies Growth</h3>
        <div className="flex-1 min-h-[250px]">
          <Bar data={agenciesGrowthData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">Earning Growth</h3>
        <div className="flex-1 min-h-[250px]">
          <Bar data={earningGrowthData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
