import { PlatformBillingTable } from "./PlatformBillingTable";

/**
 * The Invoices table used to render fabricated rows from
 * `components/billing/billing.ts`. Until `GET /admin/billing/invoices`
 * exists, we render an honest empty state so a developer reading the
 * UI is never misled into thinking the data is real.
 */
export function InvoicesTab() {
  return (
    <div className="space-y-4"><h2 className="text-[24px] font-bold text-foreground">Invoice History</h2><PlatformBillingTable resource="invoices" /></div>
  );
}
