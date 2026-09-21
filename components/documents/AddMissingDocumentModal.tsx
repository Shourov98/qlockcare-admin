"use client";

import { FormEvent, useState } from "react";

import type { Agency } from "@/components/agencies/agencies";
import {
  createDocument,
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_TYPE_LABEL,
  DocumentStatus,
  DocumentType,
} from "../compliance/compliance";

interface AddMissingDocumentModalProps {
  isOpen: boolean;
  agencies: Pick<Agency, "id" | "name">[];
  onClose: () => void;
  onCreated: () => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  "LICENSE",
  "CERTIFICATE",
  "DOCUMENT",
  "PERMIT",
  "POLICY",
  "REPORT",
];

const DOCUMENT_STATUSES: DocumentStatus[] = [
  "MISSING",
  "PENDING",
  "VALID",
  "EXPIRING",
  "EXPIRED",
  "REJECTED",
];

export function AddMissingDocumentModal({
  isOpen,
  agencies,
  onClose,
  onCreated,
}: AddMissingDocumentModalProps) {
  const [agencyId, setAgencyId] = useState("");
  const [name, setName] = useState("");
  const [docType, setDocType] = useState<DocumentType>("DOCUMENT");
  const [status, setStatus] = useState<DocumentStatus>("MISSING");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setAgencyId("");
    setName("");
    setDocType("DOCUMENT");
    setStatus("MISSING");
    setDescription("");
    setExpiresAt("");
    setFileUrl("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agencyId || !name.trim()) {
      setError("Agency and document name are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createDocument({
        agency_id: agencyId,
        name: name.trim(),
        doc_type: docType,
        status,
        description: description.trim() || null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        file_url: fileUrl.trim() || null,
      });
      reset();
      onCreated();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to create document.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-document-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg"
      >
        <div className="mb-5">
          <h2 id="add-document-title" className="text-xl font-bold text-foreground">
            Add document record
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a required document record for an agency.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground">
              Agency
              <select required value={agencyId} onChange={(event) => setAgencyId(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select an agency</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>{agency.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-foreground">
              Document name
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. State insurance license" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Document type
              <select value={docType} onChange={(event) => setDocType(event.target.value as DocumentType)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{DOCUMENT_TYPE_LABEL[type]}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-foreground">
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value as DocumentStatus)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                {DOCUMENT_STATUSES.map((documentStatus) => (
                  <option key={documentStatus} value={documentStatus}>{DOCUMENT_STATUS_LABEL[documentStatus]}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-foreground">
              Expiration date
              <input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              File URL
              <input type="url" value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://..." />
            </label>
          </div>
          <label className="block text-sm font-medium text-foreground">
            Description
            <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Optional document details" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleClose} disabled={submitting} className="rounded-md bg-muted px-4 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted/80 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={submitting || agencies.length === 0} className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">{submitting ? "Creating..." : "Create document"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
