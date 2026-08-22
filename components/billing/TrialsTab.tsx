import React from "react";
import { PendingBackendBanner } from "./PendingBackendBanner";
import { MockedEmptyState } from "./MockedEmptyState";

/**
 * Trials & Demos used to read from `trialsData` (hardcoded sample
 * trials). Now shows an honest empty state — a live `GET
 * /agencies?status=TRIAL` already exists in the backend and could
 * power this view, but it isn't wired into the billing tab yet. The
 * banner at the top of this tab names the gap.
 */
export function TrialsTab() {
  return (
    <div className="space-y-4">
      <PendingBackendBanner
        tabName="Trials & Demos"
        endpoint="GET /admin/billing/trials?status=TRIAL (filters /agencies by status=TRIAL with trial_started_at / trial_ends_at)"
      />
      <div className="overflow-hidden">
        <div className="flex items-center justify-between py-5">
          <h2 className="text-[24px] font-bold text-foreground">
            Trial & Demo Accounts
          </h2>
        </div>
        <MockedEmptyState
          feature="Trial Accounts"
          endpoint="GET /admin/billing/trials"
          hint="Live list of every agency currently in a TRIAL state, with start/end dates and the ability to end a trial early. The backend groups this on top of the existing /agencies listing."
        />
      </div>
    </div>
  );
}