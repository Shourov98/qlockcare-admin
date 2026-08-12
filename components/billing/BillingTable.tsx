import React, { useEffect, useState } from "react";
import { Loader2, ExternalLink, CreditCard } from "lucide-react";
import { Pagination } from "../common/Pagination";

import {
  listAgenciesForBilling,
  openAgencyPortal,
  startAgencyCheckout,
  type Agency,
  type AgencyStatus,
  type AgencySubscriptionPlan,
  type PaginatedAgencies,
} from "./api";

/**
 * Subscriptions table. Replaces the prior hardcoded 25-row mock with
 * a real fetch against `GET /agencies?status_filter=&plan_filter=&search=`.
 *
 * Per-row actions:
 *   - "Manage in Stripe" → POST /agencies/{id}/billing/portal-session
 *     → window.location = portal_url
 *   - "Change plan"      → POST /agencies/{id}/billing/checkout
 *     → window.location = checkout_url
 *
 * Errors render inline (503 if FEATURE_BILLING_ENABLED=false).
 */

const PLAN_BADGE: Record<AgencySubscriptionPlan, string> = {
  BASIC: "bg-gray-100 text-gray-700",
  PROFESSIONAL: "bg-blue-100 text-blue-700",
  ENTERPRISE: "bg-purple-100 text-purple-700",
};

const STATUS_BADGE: Record<AgencyStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIAL: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  CHURNED: "bg-gray-200 text-gray-700",
};

const STATUS_OPTIONS: Array<"All Status" | AgencyStatus> = [
  "All Status",
  "ACTIVE",
  "TRIAL",
  "SUSPENDED",
  "CHURNED",
];

function fmtAmount(cents: number, cycle: "monthly" | "yearly"): string {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars}/${cycle === "monthly" ? "mo" : "yr"}`;
}

export function BillingTable({
  searchQuery = "",
  statusFilter = "All Status",
}: {
  searchQuery?: string;
  statusFilter?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [data, setData] = useState<PaginatedAgencies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  const fetchPage = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAgenciesForBilling({
        page,
        page_size: ITEMS_PER_PAGE,
        status_filter:
          statusFilter && statusFilter !== "All Status"
            ? (statusFilter as AgencyStatus)
            : undefined,
        search: searchQuery.trim() || undefined,
      });
      setData(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load agencies.";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    void fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    void fetchPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const totalPages = data?.total_pages ?? 1;
  const agencies = data?.data ?? [];

  const handlePortal = async (a: Agency) => {
    setActionError(null);
    setActionBusy(`portal:${a.id}`);
    try {
      const res = await openAgencyPortal(a.id);
      window.location.href = res.portal_url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to open Stripe Portal.";
      setActionError(msg);
    } finally {
      setActionBusy(null);
    }
  };

  const handleChangePlan = async (a: Agency, plan: AgencySubscriptionPlan) => {
    setActionError(null);
    setActionBusy(`checkout:${a.id}`);
    try {
      const res = await startAgencyCheckout({
        agencyId: a.id,
        plan,
      });
      window.location.href = res.checkout_url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start Stripe Checkout.";
      setActionError(msg);
    } finally {
      setActionBusy(null);
    }
  };

  return (
    <main className="">
      {actionError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-[8px] text-sm text-red-700 font-medium">
          {actionError}
        </div>
      )}

      {loading && !data ? (
        <div className="p-8 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 mx-auto animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-sm text-red-600 font-medium mb-2">{error}</p>
          <button
            onClick={() => fetchPage(currentPage)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      ) : agencies.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No agencies match your filters.
        </div>
      ) : (
        <>
          <table className="bg-card w-full text-left text-[14px] overflow-hidden text-foreground rounded-[12px]">
            <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Billing Cycle</th>
                <th className="px-6 py-4">Stripe Customer</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex flex-col">
                      <span>{a.name}</span>
                      <span className="text-xs text-muted-foreground">{a.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${PLAN_BADGE[a.subscription_plan]}`}
                    >
                      {a.subscription_plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${STATUS_BADGE[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {fmtAmount(a.subscription_price_cents, a.subscription_billing_cycle)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {a.subscription_billing_cycle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-muted-foreground">
                      {a.stripe_customer_id ? `${a.stripe_customer_id.slice(0, 12)}…` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => handlePortal(a)}
                        disabled={actionBusy === `portal:${a.id}`}
                        title="Open Stripe Customer Portal"
                        className="inline-flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                      >
                        {actionBusy === `portal:${a.id}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                        Manage
                      </button>

                      <div className="relative">
                        <select
                          defaultValue=""
                          disabled={actionBusy === `checkout:${a.id}`}
                          onChange={(e) => {
                            const plan = e.target.value as AgencySubscriptionPlan;
                            e.currentTarget.value = "";
                            if (plan) void handleChangePlan(a, plan);
                          }}
                          className="appearance-none cursor-pointer text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border border-border bg-white text-foreground hover:bg-muted/50 disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Change plan…
                          </option>
                          {(["BASIC", "PROFESSIONAL", "ENTERPRISE"] as AgencySubscriptionPlan[])
                            .filter((p) => p !== a.subscription_plan)
                            .map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemName="agencies"
          />
        </>
      )}
    </main>
  );
}

// Re-export the status options for the parent tab to drive its select.
export const STATUS_FILTER_OPTIONS = STATUS_OPTIONS;