import React from "react";
import { PendingBackendBanner } from "./PendingBackendBanner";
import { MockedEmptyState } from "./MockedEmptyState";

/**
 * Plans & Coupons used to render two fabricated grids (sample plans
 * and sample coupons) sourced from `components/billing/billing.ts`.
 * Now shows an honest empty state per surface so the developer
 * reading the UI knows the data isn't real.
 */
export function PlansAndCoupons() {
  return (
    <div className="space-y-6">
      <PendingBackendBanner
        tabName="Plans & Coupons"
        endpoint="GET/POST/PATCH/DELETE /admin/billing/plans + /admin/billing/coupons"
      />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Subscription Plans
          </h2>
        </div>
        <MockedEmptyState
          feature="Subscription Plans"
          endpoint="GET /admin/billing/plans"
          hint="A catalog of plans (name, price, billing cycle, feature list) used by Stripe Checkout. The cards you see below are placeholders only."
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Active Coupons
          </h2>
        </div>
        <MockedEmptyState
          feature="Coupons"
          endpoint="GET /admin/billing/coupons"
          hint="A list of discount codes (percent off, max uses, expiry). No coupon rows will render here until the endpoint exists."
        />
      </section>
    </div>
  );
}