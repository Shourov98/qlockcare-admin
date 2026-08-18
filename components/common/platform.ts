import { apiRequest } from "@/lib/api";

// Shape returned by GET /admin/platform/summary
// (see qclockcare_backend/src/modules/identity/platform_router.py)
export type AgencyStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "CHURNED";
export type AgencySubscriptionPlan = "BASIC" | "PROFESSIONAL" | "ENTERPRISE";

export type PlatformRecentAgency = {
  id: string;
  name: string;
  status: AgencyStatus;
  subscription_plan: AgencySubscriptionPlan;
  created_at: string;
};

export type PlatformSummary = {
  total_agencies: number;
  active_agencies: number;
  trial_agencies: number;
  suspended_agencies: number;
  churned_agencies: number;
  total_users: number;
  active_users: number;
  total_staff: number;
  total_patients: number;
  total_appointments: number;
  total_visits: number;
  live_visits: number;
  monthly_recurring_revenue_cents: number;
  agencies_by_plan: Record<string, number>;
  recent_agencies: PlatformRecentAgency[];
};

export async function getPlatformSummary(): Promise<PlatformSummary> {
  return apiRequest<PlatformSummary>("/admin/platform/summary");
}

export function formatCurrencyCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatCompactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toISOString().split("T")[0];
}