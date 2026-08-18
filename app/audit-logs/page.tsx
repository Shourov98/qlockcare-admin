"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AuditAction,
  AuditLog,
  actionStyle,
  listAuditLogs,
  relativeTime,
} from "@/components/audit/auditLogs";
import { ApiError } from "@/lib/api";
import { Pagination } from "@/components/common/Pagination";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 25;

const ACTIONS: AuditAction[] = [
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "EXPORT",
  "OTHER",
];

const ENTITY_TYPES = [
  "AGENCY",
  "STAFF",
  "PATIENT",
  "GUARDIAN",
  "APPOINTMENT",
  "VISIT",
  "USER",
  "AGENCY_ADMIN",
  "LOCATION",
  "AUDIT_LOG",
];

export default function AuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [action, setAction] = useState<"" | AuditAction>("");
  const [entityType, setEntityType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await listAuditLogs({
        page,
        pageSize: ITEMS_PER_PAGE,
        action: action ? (action as AuditAction) : undefined,
        entityType: entityType || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setItems(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(Math.max(result.pagination.total_pages, 1));
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Unable to load audit logs.",
      );
      setItems([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [page, action, entityType, dateFrom, dateTo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [action, entityType, dateFrom, dateTo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const clearFilters = () => {
    setAction("");
    setEntityType("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-bold text-foreground">
          Audit Logs
        </h1>
        <div className="text-sm text-muted-foreground">
          {totalItems.toLocaleString()} entries
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-[12px] p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as "" | AuditAction)}
              className="border border-border rounded-md px-3 py-1.5 bg-white text-sm"
            >
              <option value="">Any</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Entity
            </label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="border border-border rounded-md px-3 py-1.5 bg-white text-sm"
            >
              <option value="">Any</option>
              {ENTITY_TYPES.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-border rounded-md px-3 py-1.5 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-border rounded-md px-3 py-1.5 bg-white text-sm"
            />
          </div>
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-foreground">
            <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">When</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">IP</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-muted-foreground"
                    colSpan={6}
                  >
                    Loading audit logs…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-muted-foreground"
                    colSpan={6}
                  >
                    No audit log entries match the current filters.
                  </td>
                </tr>
              ) : (
                items.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr
                      className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpanded(expanded === log.id ? null : log.id)
                      }
                    >
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {relativeTime(log.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {log.actor_name || log.actor_email || "—"}
                          </span>
                          {log.actor_email && log.actor_name && (
                            <span className="text-xs text-muted-foreground">
                              {log.actor_email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${actionStyle(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {log.entity_type}
                          </span>
                          {log.entity_id && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.entity_id.slice(0, 8)}…
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                        {log.ip_address || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Search className="w-4 h-4 text-muted-foreground inline" />
                      </td>
                    </tr>
                    {expanded === log.id && (
                      <tr className="bg-muted/10 border-b border-border">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Full ID:
                              </span>{" "}
                              <code className="text-xs font-mono">
                                {log.id}
                              </code>
                            </div>
                            {log.user_agent && (
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  User-Agent:
                                </span>{" "}
                                <span className="text-xs font-mono">
                                  {log.user_agent}
                                </span>
                              </div>
                            )}
                            {log.old_data && (
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Old data:
                                </span>
                                <pre className="text-xs font-mono bg-muted/30 rounded p-2 mt-1 overflow-x-auto">
                                  {JSON.stringify(log.old_data, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.new_data && (
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  New data:
                                </span>
                                <pre className="text-xs font-mono bg-muted/30 rounded p-2 mt-1 overflow-x-auto">
                                  {JSON.stringify(log.new_data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setPage}
          itemName="entries"
        />
      </div>
    </main>
  );
}