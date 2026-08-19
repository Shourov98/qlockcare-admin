"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ClientsTable } from "../../components/clients/ClientsTable";
import { ClientsSummaryCards } from "../../components/clients/ClientsSummaryCards";
import type { PatientStatus } from "../../components/clients/client";

const STATUS_OPTIONS: { value: "" | PatientStatus; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | PatientStatus>("");

  return (
    <main className="p-6 space-y-6">
      <ClientsSummaryCards />

      <div className="overflow-x-auto overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-2 flex-wrap">
          <div className="py-5 flex justify-between items-center">
            <h2 className="text-[24px] font-bold text-foreground">
              Clients List
            </h2>
          </div>
          <div className="flex items-center justify-end gap-2 p-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "" | PatientStatus)
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
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border rounded-[12px] pl-10 pr-4 py-2 w-64"
              />
            </div>
          </div>
        </div>
        <ClientsTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>
    </main>
  );
}