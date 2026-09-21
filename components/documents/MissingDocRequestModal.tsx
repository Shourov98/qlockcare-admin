import type { AgencyDocument } from "../compliance/compliance";

interface MissingDocRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: AgencyDocument | null;
}

export function MissingDocRequestModal({ isOpen, onClose, doc }: MissingDocRequestModalProps) {
  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="request-document-title" className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 id="request-document-title" className="text-xl font-bold text-foreground">Request document</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A document-request delivery endpoint is not available yet. No email or notification will be sent from this screen.
        </p>
        <dl className="mt-5 space-y-3 rounded-lg border border-border bg-muted/20 p-4 text-sm">
          <Detail label="Agency ID">{doc.agencyId}</Detail>
          <Detail label="Required document">{doc.name}</Detail>
          <Detail label="Status">{doc.status}</Detail>
        </dl>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90">Close</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="break-all text-right text-foreground">{children}</dd></div>;
}
