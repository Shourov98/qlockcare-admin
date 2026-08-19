"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { listAuditLogs } from "@/components/audit/auditLogs";
import { listAgencies } from "@/components/agencies/agencies";
import { ApiError } from "@/lib/api";

// "Recent Activities" panel on the global dashboard.
//
// The screenshot showed fake compliance issues ("EVV Clock-in
// Mismatch" / "Missing Authorization") with invented severity and SLA
// values. There is no compliance/tickets endpoint on the backend, so
// we render an honest substitute: recent audit log events that
// represent real operational activity, with severity derived from the
// audit action rather than fabricated.
//
// Columns:
//   ISSUE     ← action + entity_type combined (e.g. "Service disputed on visit")
//   SEVERITY  ← derived from action (DISPUTED/DELETE = critical,
//                UPDATE/STATUS_TRANSITION = medium, CREATE = low)
//   SLA       ← no SLA per-event on the backend → render "—"
//   STATUS    ← derived from action (CREATE → Open, UPDATE → In Progress,
//                otherwise —)
//   AGENCY    ← looked up from audit.agency_id via cached agency table
export function RecentActivities() {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [logs, agencies] = await Promise.all([
          listAuditLogs({ page: 1, pageSize: 10 }),
          listAgencies({ page: 1, pageSize: 100 }).catch(() => ({
            data: [],
            pagination: { page: 1, page_size: 100, total: 0, total_pages: 1 },
          })),
        ]);

        if (cancelled) return;

        const agMap: Record<string, string> = {};
        for (const a of agencies.data) {
          agMap[a.id] = a.name;
        }

        setRows(
          logs.data.map((log) => ({
            id: log.id,
            issue: deriveIssue(log.action, log.entity_type),
            severity: deriveSeverity(log.action),
            sla: "—",
            status: deriveStatus(log.action),
            agencyId: log.agency_id,
            agencyName: log.agency_id ? agMap[log.agency_id] ?? null : null,
            createdAt: log.created_at,
          })),
        );
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof ApiError
              ? caught.message
              : caught instanceof Error
                ? caught.message
                : "Unable to load recent activities.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-bold text-foreground">
          Recent Activities
        </h2>
        <Link
          href="/audit-logs"
          className="text-sm text-primary hover:underline"
        >
          View audit logs →
        </Link>
      </div>
      {error ? (
        <div className="mt-3 rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      ) : null}
      <div className="mt-3 overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full text-left text-[14px] text-foreground">
          <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Issue</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">SLA</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">When</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No recent activity. New events will appear here as they
                  happen.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
                >
                  <td className="px-6 py-4 font-medium">{row.issue}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${severityStyle(row.severity)}`}
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{row.sla}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${statusStyle(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {row.agencyName ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {relativeTime(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Severity is derived from the audit action (DISPUTED / DELETE =
        critical). Full SLA tracking and ticket state land when the
        compliance module ships.
      </p>
    </section>
  );
}

interface ActivityRow {
  id: string;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  sla: string;
  status: "Open" | "In Progress" | "Resolved" | "—";
  agencyId: string | null;
  agencyName: string | null;
  createdAt: string;
}

function deriveIssue(
  action: string,
  entityType: string,
): string {
  const entity = entityType.charAt(0) + entityType.slice(1).toLowerCase();
  switch (action) {
    case "SERVICE_DISPUTED":
      return `Service disputed on ${entity.toLowerCase()}`;
    case "STATUS_TRANSITION":
      return `Status changed on ${entity.toLowerCase()}`;
    case "APPOINTMENT_CANCELLED":
      return "Appointment cancelled";
    case "APPOINTMENT_CONFIRMED":
      return "Appointment confirmed";
    case "APPOINTMENT_ASSIGNED":
      return "Appointment assigned";
    case "APPOINTMENT_RESCHEDULE_REQUESTED":
      return "Appointment reschedule requested";
    case "APPOINTMENT_CANCELLATION_REQUESTED":
      return "Appointment cancellation requested";
    case "VISIT_CHECKED_IN":
      return `${entity} checked in`;
    case "VISIT_CHECKED_OUT":
      return `${entity} checked out`;
    case "SERVICE_VERIFIED":
      return `Service verified on ${entity.toLowerCase()}`;
    case "LINK_PATIENT_GUARDIAN":
      return "Patient–guardian link created";
    case "UNLINK_PATIENT_GUARDIAN":
      return "Patient–guardian link removed";
    case "LOGIN_FAILED":
      return "Failed login attempt";
    case "ROLE_GRANTED":
      return "Role granted";
    case "ROLE_REVOKED":
      return "Role revoked";
    case "CREATE":
      return `${entity} created`;
    case "UPDATE":
      return `${entity} updated`;
    case "DELETE":
      return `${entity} deleted/archived`;
    default:
      return `${action} on ${entity.toLowerCase()}`;
  }
}

function deriveSeverity(
  action: string,
): ActivityRow["severity"] {
  switch (action) {
    case "SERVICE_DISPUTED":
    case "DELETE":
    case "LOGIN_FAILED":
      return "Critical";
    case "STATUS_TRANSITION":
    case "APPOINTMENT_CANCELLATION_REQUESTED":
    case "APPOINTMENT_RESCHEDULE_REQUESTED":
    case "UNLINK_PATIENT_GUARDIAN":
    case "UPDATE":
      return "High";
    case "CREATE":
    case "APPOINTMENT_CONFIRMED":
    case "APPOINTMENT_ASSIGNED":
    case "VISIT_CHECKED_IN":
    case "VISIT_CHECKED_OUT":
    case "SERVICE_VERIFIED":
    case "LINK_PATIENT_GUARDIAN":
      return "Medium";
    default:
      return "Low";
  }
}

function deriveStatus(action: string): ActivityRow["status"] {
  switch (action) {
    case "CREATE":
      return "Open";
    case "UPDATE":
    case "STATUS_TRANSITION":
      return "In Progress";
    case "SERVICE_VERIFIED":
    case "VISIT_CHECKED_OUT":
      return "Resolved";
    default:
      return "—";
  }
}

function severityStyle(severity: ActivityRow["severity"]): string {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-slate-100 text-slate-700";
  }
}

function statusStyle(status: ActivityRow["status"]): string {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800";
    case "Resolved":
      return "bg-green-100 text-green-700";
    case "—":
      return "bg-slate-100 text-slate-600";
  }
}

function relativeTime(iso: string): string {
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