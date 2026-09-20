import { PlatformBillingTable } from "./PlatformBillingTable";

/**
 * Same pattern as InvoicesTab — no fake transaction rows. The
 * `RefundModal` and `SendEmailModal` referenced from the old
 * `PaymentsTable` are kept available for the day this view goes
 * live; they're not imported here so the empty state stays minimal.
 */
export function PaymentsTab() {
  return (
    <div className="space-y-4"><h2 className="text-[24px] font-bold text-foreground">Payment Transactions</h2><PlatformBillingTable resource="payments" /></div>
  );
}
