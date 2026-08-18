"use client";

import React, { useState } from "react";
import { AgencyAddModal } from "../../components/agencies/AgencyAddModal";
import { AgenciesTable } from "../../components/agencies/AgenciesTable";
import { AgenciesSummaryCards } from "../../components/agencies/AgenciesSummaryCards";
import { Search } from "lucide-react";
import type { AgencyStatus } from "../../components/agencies/agencies";

const STATUS_OPTIONS: { value: "" | AgencyStatus; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "TRIAL", label: "Trial" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "CHURNED", label: "Churned" },
];

export default function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AgencyStatus>("");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <main className="p-6 space-y-6">
      <AgenciesSummaryCards />

      <div className="overflow-x-auto rounded-[12px] overflow-hidden">
        <div className="flex justify-between items-center py-2 gap-3 flex-wrap">
          <h2 className="text-[24px] font-bold text-foreground">
            Agencies List
          </h2>
          <div className="flex items-center justify-end gap-2 p-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "" | AgencyStatus)
              }
              className="border border-border rounded-[12px] px-3 py-2 bg-white text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="relative flex items-center gap-2">
              <Search className="absolute left-3 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search agencies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border rounded-[12px] pl-10 pr-4 py-2 w-64"
              />
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="bg-primary text-primary-foreground rounded-[12px] px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              Add Agency
            </button>
          </div>
        </div>
        <AgenciesTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>

      <AgencyAddModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  );
}