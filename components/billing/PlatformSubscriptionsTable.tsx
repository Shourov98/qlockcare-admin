"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { apiRequest } from "@/lib/api";

type Subscription = {
  id: string;
  agency_name: string;
  agency_status: string;
  subscription_plan: string;
  subscription_price_cents: number;
  subscription_billing_cycle: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  cancel_at_period_end: boolean;
  payment_state: string;
};
type Response = { data: Subscription[]; total: number; page: number; page_size: number; total_pages: number };

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function PlatformSubscriptionsTable({ searchQuery, statusFilter }: { searchQuery: string; statusFilter: string }) {
  const [data, setData] = useState<Response | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), page_size: "25" });
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (statusFilter !== "All Status") params.set("status", statusFilter);
    try {
      setData(await apiRequest<Response>(`/admin/billing/subscriptions?${params}`));
      setError("");
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Unable to load subscriptions.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  // Remote loading necessarily updates local request state once the effect runs.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  if (loading && !data) return <div className="flex min-h-56 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"><div className="flex gap-3"><AlertCircle className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Could not load subscriptions</p><p className="mt-1">{error}</p><button type="button" onClick={() => void load()} className="mt-2 font-semibold underline">Retry</button></div></div></div>;

  return <div className="space-y-4"><div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Agency</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Payment state</th><th className="px-5 py-3">Renewal / trial</th><th className="px-5 py-3">Lifecycle</th><th className="px-5 py-3">Stripe subscription</th></tr></thead><tbody className="divide-y divide-border">{data?.data.map((item) => <tr key={item.id} className="hover:bg-muted/25"><td className="px-5 py-4"><p className="font-semibold">{item.agency_name}</p><p className="text-xs text-muted-foreground">{item.agency_status}</p></td><td className="px-5 py-4"><p className="font-medium">{item.subscription_plan}</p><p className="text-xs text-muted-foreground">{money(item.subscription_price_cents)} / {item.subscription_billing_cycle.toLowerCase()}</p></td><td className="px-5 py-4"><span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{item.payment_state.replaceAll("_", " ")}</span></td><td className="px-5 py-4"><p>{formatDate(item.current_period_end)}</p><p className="text-xs text-muted-foreground">Trial ends: {formatDate(item.trial_ends_at)}</p></td><td className="px-5 py-4">{item.cancel_at_period_end ? <span className="text-amber-700">Cancels at period end</span> : <span className="text-muted-foreground">Renews automatically</span>}</td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.stripe_subscription_id || "Not subscribed"}</td></tr>)}</tbody></table>{!data?.data.length && <p className="p-10 text-center text-sm text-muted-foreground">No subscriptions match the current filters.</p>}</div><div className="flex items-center justify-between text-sm text-muted-foreground"><span>{data?.total ?? 0} agencies</span><div className="flex gap-2"><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button><span className="px-2 py-2">{data?.page ?? 1} / {data?.total_pages || 1}</span><button type="button" disabled={!data || page >= data.total_pages || loading} onClick={() => setPage((value) => value + 1)} className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button></div></div></div>;
}
