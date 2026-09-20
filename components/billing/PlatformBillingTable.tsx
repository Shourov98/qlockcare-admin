"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { apiRequest } from "@/lib/api";

type Resource = "invoices" | "payments" | "prices" | "coupons";
type Item = { id: string; created_at: string | null; customer_id: string | null; amount_cents: number | null; currency: string | null; status: string | null; agency_id: string | null; description: string | null };
type Response = { data: Item[]; has_more: boolean; next_cursor: string | null };

function money(cents: number | null, currency: string | null) {
  if (cents === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: (currency || "usd").toUpperCase() }).format(cents / 100);
}

export function PlatformBillingTable({ resource }: { resource: Resource }) {
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiRequest<Response>(`/admin/billing/${resource}?limit=25`)
      .then((response) => { setData(response); setError(""); })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Unable to load Stripe data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    apiRequest<Response>(`/admin/billing/${resource}?limit=25`)
      .then((response) => {
        if (!active) return;
        setData(response);
        setError("");
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : "Unable to load Stripe data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [resource]);

  if (loading) return <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"><div className="flex gap-3"><AlertCircle className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Could not load Stripe data</p><p className="mt-1 text-sm">{error}</p><button type="button" onClick={load} className="mt-3 text-sm font-semibold underline">Retry</button></div></div></div>;
  if (!data?.data.length) return <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No {resource} found in Stripe.</div>;
  return <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="min-w-[760px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3">Created</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Stripe ID</th></tr></thead><tbody className="divide-y divide-border">{data.data.map((item) => <tr key={item.id}><td className="px-5 py-4 text-muted-foreground">{item.created_at ? new Date(Number(item.created_at) * 1000).toLocaleDateString() : "—"}</td><td className="px-5 py-4 font-medium">{item.description || "—"}</td><td className="px-5 py-4">{money(item.amount_cents, item.currency)}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{item.status || "—"}</span></td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.customer_id || "—"}</td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.id}</td></tr>)}</tbody></table></div>;
}
