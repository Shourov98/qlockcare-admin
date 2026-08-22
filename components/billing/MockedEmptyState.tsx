import React from "react";
import { FileQuestion, Construction } from "lucide-react";

/**
 * Renders a small "coming soon" panel for a billing view whose data is
 * not yet served by an admin endpoint. The `PendingBackendBanner`
 * already calls out the missing endpoint at the top of the tab; this
 * component is the honest body of the tab — a clear empty state
 * instead of fabricated rows from `components/billing/billing.ts`.
 *
 * The intent is to keep the developer-experience gap visible: when a
 * backend endpoint lands, this component is replaced with the live
 * table — not the other way around (we never silently re-enable the
 * fake rows).
 */
export function MockedEmptyState({
  feature,
  endpoint,
  hint,
}: {
  feature: string;
  endpoint: string;
  hint?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-[12px] shadow-sm p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">
        {feature} isn&apos;t wired up yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {hint ||
          "This view will go live once the backend exposes the endpoint below. No data is shown here in the meantime — we don't fake rows."}
      </p>
      <code className="mt-4 px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-md font-mono text-foreground">
        {endpoint}
      </code>
      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <FileQuestion className="w-3.5 h-3.5" />
        Track this work in <code className="px-1 bg-muted/40 rounded">qclockcare_backend</code> under the <code className="px-1 bg-muted/40 rounded">/admin/billing</code> router.
      </p>
    </div>
  );
}