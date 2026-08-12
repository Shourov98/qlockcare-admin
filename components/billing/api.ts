/**
 * Admin billing — thin wrapper over the existing backend endpoints.
 *
 * The backend exposes:
 *   GET    /agencies                            (SUPER_ADMIN, paginated)
 *          — provides subscription_plan, status,
 *            subscription_price_cents, subscription_billing_cycle,
 *            stripe_customer_id, name, email, id
 *   POST   /agencies/{agency_id}/billing/checkout
 *          — creates a Stripe Checkout session for the chosen plan,
 *            returns { checkout_url, session_id }
 *   POST   /agencies/{agency_id}/billing/portal-session
 *          — returns { portal_url } — the agency's Stripe Customer Portal
 *
 * No new backend endpoints are required for the SUPER_ADMIN
 * "list agencies + open Stripe Portal" flow. Per-row "Manage in
 * Stripe" buttons call portal-session and `window.location`-assign
 * the browser to the returned URL.
 *
 * Errors to expect:
 *   - 503 SERVICE_UNAVAILABLE: FEATURE_BILLING_ENABLED=false
 *   - 503 BILLING_ERROR: STRIPE_SECRET_KEY missing on the backend
 *   - 422: Stripe rejected the request (often an invalid price id)
 *   - 404: agency_id not found
 */

import { apiRequest } from "@/lib/api";

// --------------------------------------------------------------------------
// DTOs (mirror backend shape)
// --------------------------------------------------------------------------
export type AgencySubscriptionPlan = "BASIC" | "PROFESSIONAL" | "ENTERPRISE";

export type AgencyStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "CHURNED";

export type AgencyBillingCycle = "monthly" | "yearly";

export type Agency = {
  id: string;
  name: string;
  email: string;
  status: AgencyStatus;
  subscription_plan: AgencySubscriptionPlan;
  subscription_price_cents: number;
  subscription_billing_cycle: AgencyBillingCycle;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedAgencies = {
  data: Agency[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type CheckoutResponse = {
  checkout_url: string;
  session_id: string;
};

export type PortalSessionResponse = {
  portal_url: string;
};

// --------------------------------------------------------------------------
// List agencies (SUPER_ADMIN)
// --------------------------------------------------------------------------
export interface ListAgenciesArgs {
  page?: number;
  page_size?: number;
  status_filter?: AgencyStatus;
  plan_filter?: AgencySubscriptionPlan;
  search?: string;
}

export async function listAgenciesForBilling(
  args: ListAgenciesArgs = {},
): Promise<PaginatedAgencies> {
  const params = new URLSearchParams();
  if (args.page) params.set("page", String(args.page));
  if (args.page_size) params.set("page_size", String(args.page_size));
  if (args.status_filter) params.set("status_filter", args.status_filter);
  if (args.plan_filter) params.set("plan_filter", args.plan_filter);
  if (args.search) params.set("search", args.search);

  const qs = params.toString();
  return apiRequest<PaginatedAgencies>(
    `/agencies${qs ? `?${qs}` : ""}`,
  );
}

// --------------------------------------------------------------------------
// Stripe portal — admin opens an agency's Stripe Customer Portal
// --------------------------------------------------------------------------
export async function openAgencyPortal(
  agencyId: string,
): Promise<PortalSessionResponse> {
  return apiRequest<PortalSessionResponse>(
    `/agencies/${agencyId}/billing/portal-session`,
    { method: "POST", body: JSON.stringify({}) },
    /* retryOnUnauthorized */ true,
  );
}

// --------------------------------------------------------------------------
// Stripe checkout — start a new Checkout session for the chosen plan
// --------------------------------------------------------------------------
export interface StartCheckoutArgs {
  agencyId: string;
  plan: AgencySubscriptionPlan;
  successUrl?: string;
  cancelUrl?: string;
}

export async function startAgencyCheckout(
  args: StartCheckoutArgs,
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(
    `/agencies/${args.agencyId}/billing/checkout`,
    {
      method: "POST",
      body: JSON.stringify({
        plan: args.plan,
        success_url: args.successUrl ?? null,
        cancel_url: args.cancelUrl ?? null,
      }),
    },
  );
}
