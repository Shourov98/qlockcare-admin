"use client";

import React, { useEffect, useState } from "react";
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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  formatCompactNumber,
  formatCurrencyCents,
  getPlatformSummary,
  PlatformSummary,
} from "../common/platform";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { intersect: false, mode: "index" as const },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6e7976", font: { family: "Inter", size: 11 } },
    },
    y: {
      border: { display: false },
      grid: { color: "#ebefec" },
      ticks: { color: "#6e7976", font: { family: "Inter", size: 11 } },
    },
  },
};

const PLAN_LABELS = ["Basic", "Professional", "Enterprise"];
const PLAN_KEYS = ["BASIC", "PROFESSIONAL", "ENTERPRISE"] as const;

function planChart(summary: PlatformSummary) {
  const data = PLAN_KEYS.map((k) => summary.agencies_by_plan[k] || 0);
  return {
    labels: PLAN_LABELS,
    datasets: [
      {
        label: "Agencies",
        data,
        backgroundColor: "#29685e",
        borderRadius: 4,
      },
    ],
  };
}

export function GrowthCharts() {
  const [summary, setSummary] = useState<PlatformSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getPlatformSummary();
        if (!cancelled) setSummary(data);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load platform summary.",
          );
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
        {error}
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col h-[280px]"
          >
            <div className="h-4 w-32 bg-muted rounded mb-4 animate-pulse" />
            <div className="flex-1 bg-muted/30 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const revenueCents = summary.monthly_recurring_revenue_cents;
  // Display MRR as a single big number rather than a fake time series
  // until a /admin/billing/mrr endpoint ships.
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">
          Agencies by plan
        </h3>
        <div className="flex-1 min-h-[250px]">
          <Bar data={planChart(summary)} options={chartOptions} />
        </div>
      </div>
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">
          Care network
        </h3>
        <ul className="flex-1 space-y-3 text-sm">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Patients</span>
            <span className="font-semibold">
              {formatCompactNumber(summary.total_patients)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Staff</span>
            <span className="font-semibold">
              {formatCompactNumber(summary.total_staff)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Appointments</span>
            <span className="font-semibold">
              {formatCompactNumber(summary.total_appointments)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Visits to date</span>
            <span className="font-semibold">
              {formatCompactNumber(summary.total_visits)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Live now</span>
            <span className="font-semibold text-primary">
              {formatCompactNumber(summary.live_visits)}
            </span>
          </li>
        </ul>
      </div>
      <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] flex flex-col">
        <h3 className="text-foreground font-semibold text-lg mb-4">
          Monthly recurring revenue
        </h3>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[44px] leading-tight font-bold text-foreground">
            {formatCurrencyCents(revenueCents)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Sum of subscription prices for active agencies this month.
          </p>
        </div>
      </div>
    </div>
  );
}