import React from "react";
import { PendingBackendBanner } from "./PendingBackendBanner";
import { MockedEmptyState } from "./MockedEmptyState";

/**
 * Same pattern as InvoicesTab — no fake transaction rows. The
 * `RefundModal` and `SendEmailModal` referenced from the old
 * `PaymentsTable` are kept available for the day this view goes
 * live; they're not imported here so the empty state stays minimal.
 */
export function PaymentsTab() {
  return (
    <div className="space-y-4">
      <PendingBackendBanner
        tabName="Payments"
        endpoint="GET /admin/billing/payments + GET /admin/billing/refunds"
      />
      <div className="overflow-hidden">
        <div className="flex items-center justify-between py-5">
          <h2 className="text-[24px] font-bold text-foreground">
            Payment Transactions
          </h2>
        </div>
        <MockedEmptyState
          feature="Payments"
          endpoint="GET /admin/billing/payments"
          hint="Charges across all agencies, with refund support. A live list will land here once the endpoint exists — no fabricated transactions are shown."
        />
      </div>
    </div>
  );
}