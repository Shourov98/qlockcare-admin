import { AlertCircle } from "lucide-react";

export function LegacyBillingUnavailableNotice({ action }: { action: string }) {
  return (
    <div className="mx-6 mt-5 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p><span className="font-semibold">{action} is not available.</span> This workflow does not have an approved backend API yet.</p>
    </div>
  );
}
