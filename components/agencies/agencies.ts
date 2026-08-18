import { apiRequest } from "@/lib/api";

// Mirrors `qlockcare_backend/src/shared/domain/enums.py`.
// `subscriptionPlan` is shown as a badge in the table, `status`
// drives the ACTIVE/TRIAL/SUSPENDED/CHURNED lifecycle.
export type AgencyStatus =
  | "ACTIVE"
  | "TRIAL"
  | "SUSPENDED"
  | "CHURNED";

export type AgencySubscriptionPlan =
  | "BASIC"
  | "PROFESSIONAL"
  | "ENTERPRISE";

type PlatformAgency = {
  id: string;
  name: string;
  status: AgencyStatus;
  timezone: string;
  subscription_plan: AgencySubscriptionPlan;
  subscription_price_cents: number;
  subscription_billing_cycle: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

// Frontend projection — derived fields like `subscription_price_cents`
// → formatted string so the table doesn't have to think about currency.
export type Agency = {
  id: string;
  name: string;
  status: AgencyStatus;
  timezone: string;
  subscriptionPlan: AgencySubscriptionPlan;
  subscriptionPriceCents: number;
  subscriptionPriceDisplay: string;
  billingCycle: string;
  isTrialing: boolean;
  trialEndsAt: string | null;
  hasStripeSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AgencyListResult = {
  data: Agency[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

// `POST /agencies` requires a bound `AGENCY_ADMIN`. Two branches:
//   1. new user (email + full_name required, password optional)
//   2. promote existing user (existing_user_id set)
// The form only sends the new-user branch — promoting happens from
// the agency's admin list page (deferred).
export type AgencyCreateInput = {
  name: string;
  timezone?: string;
  subscriptionPlan: AgencySubscriptionPlan;
  startTrial?: boolean;
  trialDays?: number;
  initialProgramCodes?: string[];
  admin: {
    email: string;
    fullName: string;
    phone?: string;
    password?: string; // omitted = INVITED, set = ACTIVE
  };
};

export type AgencyUpdateInput = {
  name?: string;
  timezone?: string;
  status?: AgencyStatus;
  subscriptionPlan?: AgencySubscriptionPlan;
  trialEndsAt?: string | null;
  settings?: Record<string, unknown>;
};

function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

function mapAgency(raw: PlatformAgency): Agency {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status,
    timezone: raw.timezone,
    subscriptionPlan: raw.subscription_plan,
    subscriptionPriceCents: raw.subscription_price_cents,
    subscriptionPriceDisplay: formatPrice(raw.subscription_price_cents),
    billingCycle: raw.subscription_billing_cycle,
    isTrialing: raw.status === "TRIAL",
    trialEndsAt: raw.trial_ends_at,
    hasStripeSubscription: !!raw.stripe_subscription_id,
    cancelAtPeriodEnd: raw.cancel_at_period_end,
    createdAt: formatDate(raw.created_at),
    updatedAt: formatDate(raw.updated_at),
  };
}

export async function listAgencies(params: {
  page: number;
  pageSize: number;
  search?: string;
  statusFilter?: AgencyStatus;
}): Promise<AgencyListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.statusFilter) {
    query.set("status_filter", params.statusFilter);
  }

  type Envelope = {
    data: PlatformAgency[];
    pagination: AgencyListResult["pagination"];
  };
  const result = await apiRequest<Envelope>(`/agencies?${query}`);
  return {
    data: result.data.map(mapAgency),
    pagination: result.pagination,
  };
}

export async function getAgency(id: string): Promise<Agency> {
  const raw = await apiRequest<PlatformAgency>(`/agencies/${id}`);
  return mapAgency(raw);
}

export async function createAgency(input: AgencyCreateInput): Promise<Agency> {
  const body = {
    name: input.name,
    timezone: input.timezone || "America/Chicago",
    subscription_plan: input.subscriptionPlan,
    start_trial: input.startTrial || false,
    trial_days: input.trialDays || 14,
    initial_program_codes: input.initialProgramCodes || [],
    admin: {
      email: input.admin.email,
      full_name: input.admin.fullName,
      phone: input.admin.phone || null,
      // Omit password entirely (not null) when INVITED — the backend
      // treats absent as "send invitation email".
      ...(input.admin.password ? { password: input.admin.password } : {}),
    },
  };

  const raw = await apiRequest<PlatformAgency>("/agencies", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapAgency(raw);
}

export async function updateAgency(
  id: string,
  input: AgencyUpdateInput,
): Promise<Agency> {
  const body: Record<string, unknown> = {};
  if (input.name !== undefined) body.name = input.name;
  if (input.timezone !== undefined) body.timezone = input.timezone;
  if (input.status !== undefined) body.status = input.status;
  if (input.subscriptionPlan !== undefined) {
    body.subscription_plan = input.subscriptionPlan;
  }
  if (input.trialEndsAt !== undefined) {
    body.trial_ends_at = input.trialEndsAt;
  }
  if (input.settings !== undefined) body.settings = input.settings;

  const raw = await apiRequest<PlatformAgency>(`/agencies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return mapAgency(raw);
}

export async function softDeleteAgency(id: string): Promise<void> {
  await apiRequest<void>(`/agencies/${id}`, { method: "DELETE" });
}