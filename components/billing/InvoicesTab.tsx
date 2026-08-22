import React from "react";
import { PendingBackendBanner } from "./PendingBackendBanner";
import { MockedEmptyState } from "./MockedEmptyState";

/**
 * The Invoices table used to render fabricated rows from
 * `components/billing/billing.ts`. Until `GET /admin/billing/invoices`
 * exists, we render an honest empty state so a developer reading the
 * UI is never misled into thinking the data is real.
 */
export function InvoicesTab() {
  return (
    <div className="space-y-4">
      <PendingBackendBanner
        tabName="Invoices"
        endpoint="GET /admin/billing/invoices (paginated, filtered by agency_id / status / date range)"
      />
      <div className="overflow-hidden">
        <div className="flex items-center justify-between py-5">
          <h2 className="text-[24px] font-bold text-foreground">
            Invoices History
          </h2>
        </div>
        <MockedEmptyState
          feature="Invoices"
          endpoint="GET /admin/billing/invoices"
          hint="A paginated listing of every invoice across all agencies, filterable by status and date range. Until this endpoint exists, no invoices can be shown."
        />
      </div>
    </div>
  );
}