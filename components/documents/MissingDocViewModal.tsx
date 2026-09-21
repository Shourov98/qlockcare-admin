import { AlertTriangle, FileText } from "lucide-react";

import {
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_TYPE_LABEL,
  documentStatusColor,
  type AgencyDocument,
} from "../compliance/compliance";

interface MissingDocViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: AgencyDocument | null;
}

export function MissingDocViewModal({ isOpen, onClose, doc }: MissingDocViewModalProps) {
  if (!isOpen || !doc) return null;

  const styles = documentStatusColor(doc.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="document-detail-title" className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.bg} ${styles.text}`}><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <h2 id="document-detail-title" className="text-xl font-bold text-foreground">Document details</h2>
            <p className="text-sm text-muted-foreground">{doc.name}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <div className="flex items-center gap-3 border-b border-border p-4"><FileText className="h-5 w-5 text-muted-foreground" /><span className="font-medium text-foreground">{doc.name}</span></div>
          <dl className="space-y-3 p-4 text-sm">
            <Detail label="Agency ID">{doc.agencyId}</Detail>
            <Detail label="Type">{DOCUMENT_TYPE_LABEL[doc.docType]}</Detail>
            <Detail label="Status"><span className={`font-medium ${styles.text}`}>{DOCUMENT_STATUS_LABEL[doc.status]}</span></Detail>
            <Detail label="Expires">{doc.expiresAt ?? "No expiration date"}</Detail>
            <Detail label="Description">{doc.description ?? "No description provided"}</Detail>
            <Detail label="Last updated">{doc.updatedAt}</Detail>
          </dl>
        </div>

        {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Open document file</a>}
        <div className="mt-8 flex justify-end"><button type="button" onClick={onClose} className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90">Close</button></div>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="break-all text-right text-foreground">{children}</dd></div>;
}
