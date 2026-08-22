"use client";

import React, { useState } from "react";
import {
    DocumentType,
    DOCUMENT_TYPE_LABEL,
    createLicense,
} from "./compliance";

interface ComplianceLicenseAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const TYPE_OPTIONS: DocumentType[] = [
    "LICENSE",
    "CERTIFICATE",
    "DOCUMENT",
    "PERMIT",
    "POLICY",
    "REPORT",
];

export function ComplianceLicenseAddModal({
    isOpen,
    onClose,
    onCreated,
}: ComplianceLicenseAddModalProps) {
    const [agencyId, setAgencyId] = useState("");
    const [name, setName] = useState("");
    const [docType, setDocType] = useState<DocumentType>("LICENSE");
    const [expiresAt, setExpiresAt] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const reset = () => {
        setAgencyId("");
        setName("");
        setDocType("LICENSE");
        setExpiresAt("");
        setReferenceNumber("");
        setNotes("");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agencyId.trim() || !name.trim() || !expiresAt) {
            setError("Agency, name, and expiry date are required.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await createLicense({
                agency_id: agencyId.trim(),
                name: name.trim(),
                expires_at: new Date(expiresAt).toISOString(),
                doc_type: docType,
                reference_number: referenceNumber.trim() || null,
                notes: notes.trim() || null,
            });
            reset();
            onCreated?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create license");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-card rounded-xl shadow-lg w-[400px] p-6 border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Add Document / License</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-2 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Agency ID</label>
                        <input
                            type="text"
                            required
                            value={agencyId}
                            onChange={(e) => setAgencyId(e.target.value)}
                            placeholder="UUID of the agency"
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value as DocumentType)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            {TYPE_OPTIONS.map((t) => (
                                <option key={t} value={t}>{DOCUMENT_TYPE_LABEL[t]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Document Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. State Insurance License"
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Expiry Date</label>
                        <input
                            type="date"
                            required
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Reference Number</label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="Optional"
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Notes</label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional"
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={() => { reset(); onClose(); }}
                            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                        >
                            {submitting ? "Adding…" : "Add Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}