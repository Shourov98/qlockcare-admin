"use client";

import React, { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, Sparkles } from "lucide-react";
import {
  getPlatformSummary,
  formatCurrencyCents,
  relativeTime,
  type PlatformSummary,
} from "@/components/common/platform";

// Live, server-driven summary at the top of the agencies page.
// The previous version applied a fake monthly multiplier to a
// hardcoded array — that math never reflected reality. Pull the
// real aggregates from `/admin/platform/summary` instead.
//
// Note: the backend exposes aggregated counts only (no time-series).
// Month/year dropdowns are intentionally removed because we have no
// server-side data to slice them against.
export function AgenciesSummaryCards() {
  const [summary, setSummary] = useState<PlatformSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPlatformSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Failed to load summary",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      title: "Total Agencies",
      value: summary ? summary.total_agencies.toLocaleString() : "—",
      subtext: summary
        ? `${summary.active_agencies} active · ${summary.trial_agencies} trialing`
        : "Loading…",
      status: "success",
      icon: Building2,
    },
    {
      title: "Total Users",
      value: summary ? summary.total_users.toLocaleString() : "—",
      subtext: summary
        ? `${summary.active_users} active this period`
        : "Loading…",
      status: "success",
      icon: Users,
    },
    {
      title: "Subscription Plans",
      value: summary
        ? Object.values(summary.agencies_by_plan).reduce((a, b) => a + b, 0).toLocaleString()
        : "—",
      subtext: summary
        ? Object.entries(summary.agencies_by_plan)
            .map(([plan, count]) => `${plan}: ${count}`)
            .join(" · ")
        : "Loading…",
      status: "purple",
      icon: Sparkles,
    },
    {
      title: "Monthly Recurring Revenue",
      value: summary ? formatCurrencyCents(summary.monthly_recurring_revenue_cents) : "—",
      subtext: summary
        ? `Last signup: ${summary.recent_agencies[0] ? relativeTime(summary.recent_agencies[0].created_at) : "n/a"}`
        : "Loading…",
      status: "success",
      icon: TrendingUp,
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((kpi, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between ${
            loading ? "opacity-60" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <kpi.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${
                kpi.status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {kpi.subtext}
            </span>
          </div>
          <div>
            <p className="text-muted-foreground text-[14px]">{kpi.title}</p>
            <h3 className="text-[32px] leading-[1.3] font-semibold text-foreground mt-1">
              {kpi.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
