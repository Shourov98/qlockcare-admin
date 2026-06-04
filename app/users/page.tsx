"use client";

import React from "react";
import SummaryCard from "../../components/common/SummaryCard";
import { DataTable, Column } from "../../components/common/DataTable";

export default function ClientsPage() {
  const clients = [
    { name: "Acme Corp", industry: "Manufacturing", status: "Active" },
    { name: "Beta Health", industry: "Healthcare", status: "Inactive" },
    { name: "Gamma Solutions", industry: "Technology", status: "Active" },
    { name: "Delta Services", industry: "Logistics", status: "Active" },
  ];

  const total = clients.length;
  const active = clients.filter((c) => c.status === "Active").length;

  const columns: Column<typeof clients[0]>[] = [
    { header: "Client", accessor: "name" },
    { header: "Industry", accessor: "industry" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <main className="p-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard title="Total Clients" value={total} />
        <SummaryCard title="Active Clients" value={active} />
      </div>

      {/* Data table */}
      <DataTable columns={columns} data={clients} filterAccessor="name" />
    </main>
  );
}
