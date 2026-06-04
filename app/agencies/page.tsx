"use client";

import React, { useState } from "react";
import { AgencyEditModal } from "../../components/agencies/AgencyEditModal";
import { AgencyDeleteModal } from "../../components/agencies/AgencyDeleteModal";
import { AgencyAddModal } from "../../components/agencies/AgencyAddModal";
import { AgenciesTable } from "../../components/agencies/AgenciesTable";
import { AgenciesSummaryCards } from "../../components/agencies/AgenciesSummaryCards";
import { Search } from "lucide-react";

export default function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <main className="p-6 space-y-6">
      <AgenciesSummaryCards />

      <div className="overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-center justify-end gap-2 p-2">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-border rounded-[12px] pl-10 pr-4 py-2" 
            />
          </div>
          <button 
            onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground rounded-[12px] px-4 py-2"
          >
            Add Agency
          </button>
        </div>
        <AgenciesTable searchQuery={searchQuery} />
      </div>

      <AgencyAddModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  );
}
