import { PlatformBillingTable } from "./PlatformBillingTable";

/**
 * Payment data is loaded from Stripe through the platform billing API.
 * Refunds and outbound billing email are intentionally outside this console.
 */
export function PaymentsTab() {
  return (
    <div className="space-y-4"><h2 className="text-[24px] font-bold text-foreground">Payment Transactions</h2><PlatformBillingTable resource="payments" /></div>
  );
}
