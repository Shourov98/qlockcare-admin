import React, { useState } from "react";
import { Search, ChevronDown, Info } from "lucide-react";
import { BillingTable } from "./BillingTable";

interface SubscriptionsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Subscriptions tab. Replaces the prior mock data + BillingSummaryCards
 * with a real listing of agencies pulled from `GET /agencies`. Per-row
 * actions go to Stripe (Customer Portal for plan / payment management,
 * or a new Checkout session for a plan upgrade).
 *
 * Why this view exists: the backend already exposes `/agencies` with
 * subscription_plan, status, stripe_customer_id, etc. The remaining
 * 4 tabs (Invoices, Payments, Trials, Plans & Coupons) require new
 * backend endpoints (per the audit); they're stubbed with an honest
 * "Pending backend" banner on the BillingPage until those endpoints
 * exist.
 */
export function SubscriptionsTab({
  searchQuery,
  setSearchQuery,
}: SubscriptionsTabProps) {
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-[12px] text-blue-700 text-sm">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Subscription management via Stripe</p>
          <p className="text-xs mt-1">
            Plan changes and billing detail happen in each agency's Stripe
            Customer Portal. "Manage" opens that portal; "Change plan" starts
            a fresh Checkout session. To see aggregate MRR / failed payments
            across all agencies, enable <code className="px-1 bg-blue-100 rounded">/admin/billing/*</code> on the backend.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto overflow-hidden">
        <div className="flex items-center justify-between py-5 flex-wrap gap-3">
          <h2 className="text-[24px] font-bold text-foreground">Agency Subscriptions</h2>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border bg-muted/20 rounded-[8px] pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 border border-border px-4 py-2 pr-10 rounded-[8px] text-sm font-medium hover:bg-muted/50 transition-colors bg-white text-foreground cursor-pointer focus:outline-none"
              >
                <option value="All Status">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CHURNED">Churned</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <BillingTable searchQuery={searchQuery} statusFilter={statusFilter} />
      </div>
    </div>
  );
}
