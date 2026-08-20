"use client";

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import {
  getPlatformSummary,
  type PlatformSummary,
} from "@/components/common/platform";

// "Staff" summary cards on /staff.
//
// Reads platform aggregates from `/admin/platform/summary`:
//
//   Total staff        ← total_staff
//   Active staff       ← no aggregate yet — honest "—"
//   New hires this wk  ← no per-week aggregate yet — honest "—"
//
// The two "—" cards mirror the ClientsSummaryCards pattern: the
// backend doesn't surface per-tenant time-series, so we'd rather show
// a known gap than fake a number.
export function StaffSummaryCards() {
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3">
        {error}
      </div>
    );
  }

  const totalStaff = summary?.total_staff ?? 0;
  const activeAgencies = summary?.active_agencies ?? 0;

  const cards = [
    {
      title: "Total Staff",
      value: loading ? "…" : totalStaff.toLocaleString(),
      subtext: loading
        ? "Loading…"
        : `Across ${activeAgencies} active agencies`,
      status: "success",
      icon: Users,
    },
    {
      title: "Active Staff",
      value: loading ? "…" : "—",
      subtext: "Per-tenant active count not aggregated yet",
      status: "warning",
      icon: UserCheck,
    },
    {
      title: "New Hires",
      value: "—",
      subtext: "Weekly signup endpoint pending",
      status: "purple",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((kpi, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between ${
            loading ? "opacity-70" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <kpi.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${
                kpi.status === "success"
                  ? "bg-green-100 text-green-700"
                  : kpi.status === "warning"
                    ? "bg-orange-100 text-orange-700"
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