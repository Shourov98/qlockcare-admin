import { PlatformBillingTable } from "./PlatformBillingTable";

/**
 * Plans & Coupons used to render two fabricated grids (sample plans
 * and sample coupons) sourced from `components/billing/billing.ts`.
 * Prices are backed by Stripe. Coupons remain read-only because promotion
 * management is intentionally outside the current platform billing scope.
 */
export function PlansAndCoupons() {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Subscription Plans
          </h2>
        </div>
        <PlatformBillingTable resource="prices" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Active Coupons
          </h2>
        </div>
        <PlatformBillingTable resource="coupons" />
      </section>
    </div>
  );
}
