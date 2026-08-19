import React from "react";
import {
  patientStatusLabel,
  patientStatusStyle,
  type Patient,
} from "./client";

interface ClientViewModalProps {
  isOpen: boolean;
  client: Patient | null;
  onClose: () => void;
}

// View modal for a single client (Patient).
//
// Previously showed 8 hardcoded fields (Name, Email, Mobile, Guardian
// x3, …) all derived from the same mock object. Now reads the real
// `Patient` row returned by `/admin/people/patients`.
//
// Guardian rows are not on the cross-tenant endpoint yet (a
// /admin/people/guardians route will land in a follow-up), so we
// show an honest "Not loaded" hint instead of fabricating rows.
export function ClientViewModal({ isOpen, client, onClose }: ClientViewModalProps) {
  if (!isOpen || !client) return null;

  const admitDate = client.admitted_at
    ? new Date(client.admitted_at).toISOString().split("T")[0]
    : "—";
  const dischargeDate = client.discharged_at
    ? new Date(client.discharged_at).toISOString().split("T")[0]
    : "—";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[480px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Client Details</h2>
          <span
            className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${patientStatusStyle(client.status)}`}
          >
            {patientStatusLabel(client.status)}
          </span>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Name" value={client.full_name ?? "—"} />
          <Row label="Patient code" value={client.patient_code} mono />
          <Row label="Agency" value={client.agency_name ?? "—"} />
          <Row label="Email" value={client.email ?? "—"} />
          <Row label="Phone" value={client.phone ?? "—"} />
          <Row
            label="Date of birth"
            value={
              client.date_of_birth
                ? new Date(client.date_of_birth).toISOString().split("T")[0]
                : "—"
            }
          />
          <Row label="Gender" value={client.gender ?? "—"} />
          <Row label="Preferred language" value={client.preferred_language ?? "—"} />
          <Row label="Admitted" value={admitDate} />
          <Row label="Discharged" value={dischargeDate} />
        </dl>

        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold mb-1">Care notes</h3>
          <p className="text-sm text-muted-foreground">
            {client.care_notes || "No care notes recorded."}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold mb-1">Guardians</h3>
          <p className="text-xs text-muted-foreground">
            Guardian relationships aren&apos;t loaded on the cross-tenant
            admin endpoint yet. View this client from their agency&apos;s
            account to see linked guardians.
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