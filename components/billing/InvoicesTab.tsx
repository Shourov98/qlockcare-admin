import React from "react";
import { Search } from "lucide-react";
import { InvoicesTable } from "./InvoicesTable";
import { PendingBackendBanner } from "./PendingBackendBanner";

interface InvoicesTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function InvoicesTab({ searchQuery, setSearchQuery }: InvoicesTabProps) {
  return (
    <div className="space-y-4">
      <PendingBackendBanner
        tabName="Invoices"
        endpoint="GET /admin/billing/invoices (paginated, filtered by agency_id / status / date range)"
      />
      <div className="overflow-x-auto rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between py-5">
          <h2 className="text-[24px] font-bold text-foreground">Invoices History</h2>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-border bg-muted/20 rounded-[8px] pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <InvoicesTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
