import React from "react";
import { Info } from "lucide-react";

/**
 * Honest "this view is mocked — backend pending" banner shown on tabs
 * whose data isn't yet served by an admin-billing endpoint. The
 * `endpoint` string is the canonical endpoint we propose building
 * (mapped from the audit). Hovering the tab in the sidebar this
 * banner sits under surfaces the exact gap to the developer.
 *
 * Used on:
 *   - Invoices       (needs /admin/billing/invoices)
 *   - Payments       (needs /admin/billing/payments)
 *   - Trials & Demos (needs /admin/billing/trials)
 *   - Plans & Coupons (needs /admin/billing/plans + /admin/billing/coupons)
 */
export function PendingBackendBanner({
  tabName,
  endpoint,
}: {
  tabName: string;
  endpoint: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-[12px] text-amber-900 text-sm">
      <Info className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">
          {tabName} tab — mocked
        </p>
        <p className="text-xs mt-1">
          This view reads from <code className="px-1 bg-amber-100 rounded">components/billing/billing.ts</code>.
          The data below is not real. To make this tab live, the backend
          needs <code className="px-1 bg-amber-100 rounded">{endpoint}</code>.
        </p>
      </div>
    </div>
  );
}
