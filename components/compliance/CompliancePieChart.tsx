"use client";

import { MoreHorizontal } from "lucide-react";
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type ComplianceSegment = {
  label: string;
  value: number;
  color: string;
};

// This is retained sample data until the backend provides an agency-level
// compliance distribution endpoint. It is intentionally typed separately
// from the aggregate document and license counters already used by cards.
const COMPLIANCE_SEGMENTS: readonly ComplianceSegment[] = [
  { label: "Compliant", value: 75, color: "#10b981" },
  { label: "At risk", value: 16.7, color: "#f59e0b" },
  { label: "Critical issues", value: 8.33, color: "#ef4444" },
];

const pieChartData: ChartData<"pie", number[], string> = {
  labels: COMPLIANCE_SEGMENTS.map((segment) => segment.label),
  datasets: [
    {
      data: COMPLIANCE_SEGMENTS.map((segment) => segment.value),
      backgroundColor: COMPLIANCE_SEGMENTS.map((segment) => segment.color),
      borderWidth: 0,
    },
  ],
};

const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true, boxWidth: 8, padding: 20 },
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"pie">) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
  cutout: "0%",
};

export function CompliancePieChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Compliance status overview</h3>
        <button type="button" aria-label="More compliance chart options" className="text-muted-foreground transition-colors hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex h-[280px] items-center justify-center">
        <div className="h-full w-full max-w-[280px]">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}
