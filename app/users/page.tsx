"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ClientsTable } from "../../components/clients/ClientsTable";
import { ClientsSummaryCards } from "../../components/clients/ClientsSummaryCards";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="p-6 space-y-6">
      <ClientsSummaryCards />
      <div className="overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-center justify-end gap-2 p-2">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-border rounded-[12px] pl-10 pr-4 py-2"
            />
          </div>
        </div>
        <ClientsTable searchQuery={searchQuery} />
      </div>
    </main>
  );
}
