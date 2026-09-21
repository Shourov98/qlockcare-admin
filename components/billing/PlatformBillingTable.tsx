"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Archive, ChevronLeft, ChevronRight, ExternalLink, Loader2, Plus, Search, X } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { apiRequest } from "@/lib/api";

type Resource = "invoices" | "payments" | "prices" | "coupons";
type Item = {
  id: string; created_at: string | null; customer_id: string | null; amount_cents: number | null;
  currency: string | null; status: string | null; agency_id: string | null; agency_name: string | null;
  customer_name: string | null; customer_email: string | null; description: string | null;
};
type Detail = Item & {
  hosted_invoice_url: string | null; invoice_pdf_url: string | null; due_at: string | null;
  payment_intent_id: string | null; product_id: string | null; recurring_interval: string | null;
  active: boolean | null; metadata: Record<string, string>;
};
type Response = { data: Item[]; has_more: boolean; next_cursor: string | null };

const LABELS: Record<Resource, string> = { invoices: "invoices", payments: "payments", prices: "prices", coupons: "coupons" };

function money(cents: number | null, currency: string | null) {
  if (cents === null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: (currency || "usd").toUpperCase() }).format(cents / 100);
}

function displayDate(value: string | null) {
  if (!value) return "-";
  const date = /^\d+$/.test(value) ? new Date(Number(value) * 1000) : new Date(value);
  return Number.isNaN(date.valueOf()) ? "-" : date.toLocaleDateString();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to load billing data.";
}

export function PlatformBillingTable({ resource }: { resource: Resource }) {
  const { user } = useAuth();
  const [data, setData] = useState<Response | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("active");
  const [cursors, setCursors] = useState<Array<string | null>>([null]);
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [priceBusy, setPriceBusy] = useState(false);
  const canManagePrices = user?.role === "SUPER_ADMIN";
  const currentCursor = cursors[page] ?? null;

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ limit: "25" });
    if (currentCursor) params.set("starting_after", currentCursor);
    if (search.trim()) params.set("search", search.trim());
    if (resource === "invoices" && status) params.set("status", status);
    if (resource === "prices" && active) params.set("active", String(active === "active"));
    return params.toString();
  }, [active, currentCursor, resource, search, status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<Response>(`/admin/billing/${resource}?${queryString}`);
      setData(response);
      setError("");
    } catch (caught: unknown) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [queryString, resource]);

  // This component is remounted for each billing tab. Loading here keeps the
  // request lifecycle tied to the active resource and its cursor/filter state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const resetPagination = () => { setCursors([null]); setPage(0); };
  const applyFilters = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); resetPagination(); setSearch(searchInput); };
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); resetPagination(); };

  const showDetail = async (id: string) => {
    setDetailLoading(true); setDetail(null);
    try { setDetail(await apiRequest<Detail>(`/admin/billing/${resource}/${id}`)); }
    catch (caught: unknown) { setError(errorMessage(caught)); }
    finally { setDetailLoading(false); }
  };

  const archivePrice = async (price: Item) => {
    if (!window.confirm(`Archive ${price.description || price.id}? It cannot be used for new subscriptions.`)) return;
    setPriceBusy(true);
    try {
      await apiRequest<Detail>(`/admin/billing/prices/${price.id}`, { method: "PATCH", body: JSON.stringify({ active: false }) });
      await load();
    } catch (caught: unknown) { setError(errorMessage(caught)); }
    finally { setPriceBusy(false); }
  };

  const createPrice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPriceBusy(true);
    try {
      await apiRequest<Detail>("/admin/billing/prices", {
        method: "POST",
        body: JSON.stringify({
          product_id: String(form.get("product_id") || ""), unit_amount_cents: Math.round(Number(form.get("amount") || 0) * 100),
          currency: String(form.get("currency") || "usd"), recurring_interval: String(form.get("interval") || "month"),
          nickname: String(form.get("nickname") || "") || null,
        }),
      });
      setShowPriceForm(false); resetPagination(); await load();
    } catch (caught: unknown) { setError(errorMessage(caught)); }
    finally { setPriceBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <form className="flex flex-wrap items-end gap-3" onSubmit={applyFilters}>
          <label className="grid gap-1 text-xs font-semibold text-muted-foreground">Search<span className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={`Search ${LABELS[resource]}`} className="h-9 w-56 rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" /></span></label>
          {resource === "invoices" && <label className="grid gap-1 text-xs font-semibold text-muted-foreground">Status<select value={status} onChange={(event) => changeFilter(setStatus, event.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"><option value="">All statuses</option><option value="paid">Paid</option><option value="open">Open</option><option value="draft">Draft</option><option value="void">Void</option><option value="uncollectible">Uncollectible</option></select></label>}
          {resource === "prices" && <label className="grid gap-1 text-xs font-semibold text-muted-foreground">Availability<select value={active} onChange={(event) => changeFilter(setActive, event.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"><option value="active">Active</option><option value="archived">Archived</option></select></label>}
          <button type="submit" className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Apply</button>
        </form>
        {resource === "prices" && canManagePrices && <button type="button" onClick={() => setShowPriceForm(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />New price</button>}
      </div>

      {error && <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Billing request failed</p><p className="mt-1">{error}</p><button type="button" onClick={() => void load()} className="mt-2 font-semibold underline">Retry</button></div></div>}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        {loading ? <div className="flex min-h-56 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : !data?.data.length ? <div className="p-10 text-center text-sm text-muted-foreground">No {LABELS[resource]} match the current filters.</div> : <table className="min-w-[880px] w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Created</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Agency / customer</th><th className="px-5 py-3">Stripe ID</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{data.data.map((item) => <tr key={item.id} className="hover:bg-muted/25"><td className="px-5 py-4 text-muted-foreground">{displayDate(item.created_at)}</td><td className="px-5 py-4 font-medium">{item.description || "-"}</td><td className="px-5 py-4">{money(item.amount_cents, item.currency)}</td><td className="px-5 py-4"><span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{item.status || "-"}</span></td><td className="px-5 py-4"><p className="font-medium">{item.agency_name || item.customer_name || "Unlinked Stripe customer"}</p><p className="text-xs text-muted-foreground">{item.customer_email || item.customer_id || "-"}</p></td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.id}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => void showDetail(item.id)} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Details</button>{resource === "prices" && canManagePrices && item.status === "ACTIVE" && <button type="button" disabled={priceBusy} onClick={() => void archivePrice(item)} title="Archive price" className="inline-flex rounded-md border border-red-200 p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50"><Archive className="h-4 w-4" /></button>}</div></td></tr>)}</tbody></table>}
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Page {page + 1}</span><div className="flex gap-2"><button type="button" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)} className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button><button type="button" disabled={!data?.has_more || loading} onClick={() => { if (!data?.next_cursor) return; setCursors((value) => [...value.slice(0, page + 1), data.next_cursor]); setPage((value) => value + 1); }} className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button></div></div>

      {(detailLoading || detail) && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30" role="dialog" aria-modal="true"><aside className="h-full w-full max-w-lg overflow-y-auto bg-background p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase text-muted-foreground">Stripe {resource.slice(0, -1)}</p><h3 className="mt-1 text-lg font-bold">{detail?.description || "Billing detail"}</h3></div><button type="button" onClick={() => setDetail(null)} className="rounded-md p-2 hover:bg-muted" aria-label="Close detail"><X className="h-5 w-5" /></button></div>{detailLoading ? <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : detail && <div className="mt-6 space-y-4 text-sm"><dl className="grid grid-cols-2 gap-x-4 gap-y-4"><div><dt className="text-muted-foreground">Amount</dt><dd className="mt-1 font-semibold">{money(detail.amount_cents, detail.currency)}</dd></div><div><dt className="text-muted-foreground">Status</dt><dd className="mt-1 font-semibold">{detail.status || "-"}</dd></div><div><dt className="text-muted-foreground">Agency</dt><dd className="mt-1 font-semibold">{detail.agency_name || "Unlinked"}</dd></div><div><dt className="text-muted-foreground">Due date</dt><dd className="mt-1 font-semibold">{displayDate(detail.due_at)}</dd></div><div><dt className="text-muted-foreground">Product</dt><dd className="mt-1 break-all font-mono text-xs">{detail.product_id || "-"}</dd></div><div><dt className="text-muted-foreground">Payment intent</dt><dd className="mt-1 break-all font-mono text-xs">{detail.payment_intent_id || "-"}</dd></div></dl>{(detail.hosted_invoice_url || detail.invoice_pdf_url) && <div className="flex flex-wrap gap-2 border-t border-border pt-4">{detail.hosted_invoice_url && <a href={detail.hosted_invoice_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-semibold hover:bg-muted">Hosted invoice<ExternalLink className="h-4 w-4" /></a>}{detail.invoice_pdf_url && <a href={detail.invoice_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-semibold hover:bg-muted">Invoice PDF<ExternalLink className="h-4 w-4" /></a>}</div>}<div className="border-t border-border pt-4"><p className="text-xs font-semibold uppercase text-muted-foreground">Metadata</p><pre className="mt-2 overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(detail.metadata, null, 2)}</pre></div></div>}</aside></div>}
      {showPriceForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" role="dialog" aria-modal="true"><form onSubmit={createPrice} className="w-full max-w-lg rounded-lg bg-background p-6 shadow-xl"><div className="flex items-center justify-between"><div><h3 className="text-lg font-bold">Create Stripe price</h3><p className="mt-1 text-sm text-muted-foreground">Prices are immutable after creation. Archive a price to stop future use.</p></div><button type="button" onClick={() => setShowPriceForm(false)} className="rounded-md p-2 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button></div><div className="mt-5 grid gap-4"><label className="grid gap-1 text-sm font-semibold">Stripe product ID<input required name="product_id" placeholder="prod_..." className="h-10 rounded-md border border-border bg-background px-3 font-mono text-sm" /></label><label className="grid gap-1 text-sm font-semibold">Price amount<input required min="0.01" step="0.01" type="number" name="amount" placeholder="49.00" className="h-10 rounded-md border border-border bg-background px-3" /></label><div className="grid grid-cols-2 gap-4"><label className="grid gap-1 text-sm font-semibold">Currency<input required defaultValue="usd" name="currency" maxLength={3} className="h-10 rounded-md border border-border bg-background px-3 lowercase" /></label><label className="grid gap-1 text-sm font-semibold">Interval<select name="interval" className="h-10 rounded-md border border-border bg-background px-3"><option value="month">Monthly</option><option value="year">Yearly</option></select></label></div><label className="grid gap-1 text-sm font-semibold">Internal label<input name="nickname" placeholder="Professional monthly" className="h-10 rounded-md border border-border bg-background px-3" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowPriceForm(false)} className="h-10 rounded-md border border-border px-4 font-semibold">Cancel</button><button disabled={priceBusy} type="submit" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-50">{priceBusy && <Loader2 className="h-4 w-4 animate-spin" />}Create price</button></div></form></div>}
    </div>
  );
}
