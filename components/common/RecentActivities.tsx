"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPlatformSummary,
  PlatformRecentAgency,
  relativeTime,
} from "./platform";

const STATUS_STYLES: Record<
  PlatformRecentAgency["status"],
  string
> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIAL: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  CHURNED: "bg-slate-100 text-slate-600",
};

const PLAN_LABEL: Record<PlatformRecentAgency["subscription_plan"], string> =
  {
    BASIC: "Basic",
    PROFESSIONAL: "Professional",
    ENTERPRISE: "Enterprise",
  };

export function RecentActivities() {
  const [recent, setRecent] = useState<PlatformRecentAgency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const summary = await getPlatformSummary();
        if (!cancelled) setRecent(summary.recent_agencies);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load recent agencies.",
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

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-bold text-foreground">
          Recent Agencies
        </h2>
        <Link
          href="/agencies"
          className="text-sm text-primary hover:underline"
        >
          View all →
        </Link>
      </div>
      {error ? (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      ) : null}
      <div className="overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full text-left text-[14px] text-foreground">
          <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-muted-foreground"
                  colSpan={5}
                >
                  Loading…
                </td>
              </tr>
            ) : recent.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-muted-foreground"
                  colSpan={5}
                >
                  No agencies yet — create one to get started.
                </td>
              </tr>
            ) : (
              recent.map((agency) => (
                <tr
                  key={agency.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
                >
                  <td className="px-6 py-4 font-medium">{agency.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${STATUS_STYLES[agency.status]}`}
                    >
                      {agency.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {PLAN_LABEL[agency.subscription_plan]}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {relativeTime(agency.created_at)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/agencies?id=${agency.id}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}