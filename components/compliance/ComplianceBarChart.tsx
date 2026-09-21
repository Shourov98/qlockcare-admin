"use client";

import { MoreHorizontal } from "lucide-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type RiskLevel = "critical" | "warning" | "healthy";

type AgencyRiskDatum = {
  agencyName: string;
  riskLevel: number;
  severity: RiskLevel;
};

const RISK_COLORS: Record<RiskLevel, string> = {
  critical: "#ef4444",
  warning: "#f59e0b",
  healthy: "#10b981",
};

// This chart is a retained design sample until the backend exposes a
// per-agency risk-series endpoint.
const RISK_BY_AGENCY: readonly AgencyRiskDatum[] = [
  { agencyName: "Alpha Benefits", riskLevel: 9, severity: "critical" },
  { agencyName: "Coastal Health", riskLevel: 7, severity: "warning" },
  { agencyName: "Elite Care", riskLevel: 5, severity: "healthy" },
  { agencyName: "Premier Wellness", riskLevel: 6, severity: "warning" },
  { agencyName: "Summit Financial", riskLevel: 3, severity: "healthy" },
  { agencyName: "Vertex Group", riskLevel: 8, severity: "critical" },
  { agencyName: "Nexus Partners", riskLevel: 4, severity: "healthy" },
  { agencyName: "Omega Solutions", riskLevel: 7, severity: "warning" },
];

const barChartData: ChartData<"bar", number[], string> = {
  labels: RISK_BY_AGENCY.map((item) => item.agencyName),
  datasets: [
    {
      label: "Risk level",
      data: RISK_BY_AGENCY.map((item) => item.riskLevel),
      backgroundColor: RISK_BY_AGENCY.map((item) => RISK_COLORS[item.severity]),
      borderRadius: 4,
    },
  ],
};

const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"bar">) => `Risk level: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 10,
      ticks: { stepSize: 2 },
      grid: { color: "#f3f4f6" },
      border: { display: false },
    },
    x: {
      grid: { display: false },
      ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } },
      border: { display: false },
    },
  },
};

export function ComplianceBarChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Risk by agency</h3>
        <button type="button" aria-label="More risk chart options" className="text-muted-foreground transition-colors hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[280px]">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
}
