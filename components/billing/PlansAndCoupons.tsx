import { PlatformBillingTable } from "./PlatformBillingTable";

/**
 * Plans & Coupons used to render two fabricated grids (sample plans
 * and sample coupons) sourced from `components/billing/billing.ts`.
 * Now shows an honest empty state per surface so the developer
 * reading the UI knows the data isn't real.
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
