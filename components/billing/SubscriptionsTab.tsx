import React, { useState } from "react";
import { Search, ChevronDown, Info } from "lucide-react";
import { PlatformSubscriptionsTable } from "./PlatformSubscriptionsTable";

interface SubscriptionsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Platform read model for subscription lifecycle. Agencies manage their own
 * billing through their customer portal; platform staff can inspect renewal,
 * trial, and payment state without initiating an agency checkout.
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
          <p className="font-semibold">Subscription lifecycle from Stripe</p>
          <p className="text-xs mt-1">
            This platform view is read-only. Agencies update payment methods,
            plans, and invoices through their own Stripe Customer Portal.
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
        <PlatformSubscriptionsTable
          key={`${searchQuery}:${statusFilter}`}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  );
}
