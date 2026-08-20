import React from "react";
import {
  staffStatusLabel,
  staffStatusStyle,
  type Staff,
} from "./staff";

interface StaffViewModalProps {
  isOpen: boolean;
  staff: Staff | null;
  onClose: () => void;
}

// View modal for a single staff member. Read-only — the cross-tenant
// admin endpoint does not expose mutations. To edit a staff record the
// admin must sign in to that agency's account.
export function StaffViewModal({ isOpen, staff, onClose }: StaffViewModalProps) {
  if (!isOpen || !staff) return null;

  const hiredAt = staff.hired_at
    ? new Date(staff.hired_at).toISOString().split("T")[0]
    : "—";
  const terminatedAt = staff.terminated_at
    ? new Date(staff.terminated_at).toISOString().split("T")[0]
    : "—";
  const joinedAt = new Date(staff.created_at).toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[480px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Staff Details</h2>
          <span
            className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${staffStatusStyle(staff.status)}`}
          >
            {staffStatusLabel(staff.status)}
          </span>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Name" value={staff.full_name ?? "—"} />
          <Row label="Staff code" value={staff.staff_code} mono />
          <Row label="Agency" value={staff.agency_name ?? "—"} />
          <Row label="Email" value={staff.email ?? "—"} />
          <Row label="Phone" value={staff.phone ?? "—"} />
          <Row label="Hired" value={hiredAt} />
          <Row label="Terminated" value={terminatedAt} />
          <Row label="Joined" value={joinedAt} />
        </dl>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Cross-tenant admin view is read-only. To edit this staff record
            (status, qualifications, availability) sign in to their
            agency&apos;s account.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground font-medium">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : ""}>{value}</dd>
    </div>
  );
}