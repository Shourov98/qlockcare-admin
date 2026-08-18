import React from "react";
import type { Agency } from "./agencies";

interface AgencyViewModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
}

// Re-export so the existing imports of `Agency` from this module
// keep working — the canonical type now lives in `./agencies`.
export type { Agency };

const STATUS_STYLES: Record<Agency["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIAL: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  CHURNED: "bg-slate-100 text-slate-600",
};

export function AgencyViewModal({
  isOpen,
  agency,
  onClose,
}: AgencyViewModalProps) {
  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[28rem] p-6">
        <h2 className="text-xl font-semibold mb-4">Agency Details</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Name</dt>
            <dd className="text-foreground text-right">{agency.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Status</dt>
            <dd>
              <span
                className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${STATUS_STYLES[agency.status]}`}
              >
                {agency.status}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Timezone</dt>
            <dd className="text-foreground text-right">{agency.timezone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Plan</dt>
            <dd className="text-foreground text-right">
              {agency.subscriptionPlan}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Price</dt>
            <dd className="text-foreground text-right">
              {agency.subscriptionPriceDisplay} / {agency.billingCycle}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Trial ends</dt>
            <dd className="text-foreground text-right">
              {agency.isTrialing
                ? new Date(agency.trialEndsAt || "").toISOString().split("T")[0]
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Stripe</dt>
            <dd className="text-foreground text-right">
              {agency.hasStripeSubscription
                ? agency.cancelAtPeriodEnd
                  ? "Active (cancels at period end)"
                  : "Active"
                : "Not connected"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Created</dt>
            <dd className="text-foreground text-right">{agency.createdAt}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-muted-foreground">Updated</dt>
            <dd className="text-foreground text-right">{agency.updatedAt}</dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}