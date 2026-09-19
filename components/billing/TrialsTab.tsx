"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CalendarClock, Loader2 } from "lucide-react";

import { Pagination } from "@/components/common/Pagination";
import {
  listAgencies,
  type Agency,
  type AgencyListResult,
} from "@/components/agencies/agencies";

const PAGE_SIZE = 10;

function formatDate(value: string | null): string {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function trialState(trialEndsAt: string | null): {
  label: string;
  className: string;
} {
  if (!trialEndsAt) {
    return { label: "End date unavailable", className: "bg-slate-100 text-slate-700" };
  }

  const days = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: "Expired", className: "bg-red-100 text-red-700" };
  if (days === 0) return { label: "Ends today", className: "bg-amber-100 text-amber-800" };
  if (days <= 7) return { label: `${days} day${days === 1 ? "" : "s"} remaining`, className: "bg-amber-100 text-amber-800" };
  return { label: `${days} days remaining`, className: "bg-blue-100 text-blue-700" };
}

export function TrialsTab() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AgencyListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;

    void listAgencies({
      page,
      pageSize: PAGE_SIZE,
      statusFilter: "TRIAL",
    })
      .then((response) => {
        if (!active) return;
        setResult(response);
        setError("");
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setResult(null);
        setError(caught instanceof Error ? caught.message : "Unable to load trial agencies.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, reloadVersion]);

  const trials = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-[24px] font-bold text-foreground">Trial &amp; Demo Accounts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Agencies currently using a trial subscription.
          </p>
        </div>
        {pagination ? (
          <span className="text-sm font-medium text-muted-foreground">
            {pagination.total} active trial{pagination.total === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading trial accounts" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Could not load trial accounts</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setReloadVersion((version) => version + 1);
                }}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : trials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">No active trial accounts</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Agencies created with a trial will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Agency</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Trial started</th>
                  <th className="px-6 py-4">Trial ends</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trials.map((agency: Agency) => {
                  const state = trialState(agency.trialEndsAt);
                  return (
                    <tr key={agency.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{agency.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{agency.timezone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {agency.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(agency.trialStartedAt)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(agency.trialEndsAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${state.className}`}>
                          {state.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/agencies"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          Manage agency <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pagination ? (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.page_size}
              onPageChange={(nextPage) => {
                setIsLoading(true);
                setPage(nextPage);
              }}
              itemName="trial accounts"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
