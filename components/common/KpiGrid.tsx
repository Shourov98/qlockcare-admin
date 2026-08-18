"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  ShieldAlert,
  Users,
  DollarSign,
} from "lucide-react";
import {
  formatCompactNumber,
  formatCurrencyCents,
  getPlatformSummary,
  PlatformSummary,
} from "./platform";

interface Kpi {
  title: string;
  value: string;
  subtext: string;
  status: "success" | "warning" | "danger" | "purple";
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_PILL: Record<Kpi["status"], string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-50 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

const STATUS_ICON_BG: Record<Kpi["status"], string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

function buildKpis(summary: PlatformSummary): Kpi[] {
  return [
    {
      title: "Total agencies",
      value: formatCompactNumber(summary.total_agencies),
      subtext: `${summary.active_agencies} active · ${summary.trial_agencies} trial`,
      status: "warning",
      icon: Building2,
    },
    {
      title: "Total users",
      value: formatCompactNumber(summary.total_users),
      subtext: `${formatCompactNumber(summary.active_users)} active`,
      status: "success",
      icon: Users,
    },
    {
      title: "Total staff",
      value: formatCompactNumber(summary.total_staff),
      subtext: "Across all agencies",
      status: "purple",
      icon: Users,
    },
    {
      title: "MRR",
      value: formatCurrencyCents(summary.monthly_recurring_revenue_cents),
      subtext: `${summary.live_visits} live visits now`,
      status: "success",
      icon: DollarSign,
    },
  ];
}

const FALLBACK: PlatformSummary = {
  total_agencies: 0,
  active_agencies: 0,
  trial_agencies: 0,
  suspended_agencies: 0,
  churned_agencies: 0,
  total_users: 0,
  active_users: 0,
  total_staff: 0,
  total_patients: 0,
  total_appointments: 0,
  total_visits: 0,
  live_visits: 0,
  monthly_recurring_revenue_cents: 0,
  agencies_by_plan: {},
  recent_agencies: [],
};

export function KpiGrid() {
  const [summary, setSummary] = useState<PlatformSummary>(FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getPlatformSummary();
        if (!cancelled) setSummary(data);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load summary.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = buildKpis(summary);

  return (
    <div className="space-y-2">
      {error ? (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${STATUS_ICON_BG[kpi.status]}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${STATUS_PILL[kpi.status]}`}
              >
                {isLoading ? "—" : kpi.subtext}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-[14px]">{kpi.title}</p>
              <h3 className="text-[32px] leading-[1.3] font-semibold text-foreground mt-1">
                {isLoading ? "…" : kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}