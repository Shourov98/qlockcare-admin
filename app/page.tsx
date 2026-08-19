"use client";

import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { GrowthCharts } from "@/components/charts/GrowthCharts";
import { RecentActivities } from "@/components/common/RecentActivities";
import { KpiGrid } from "@/components/common/KpiGrid";
import { AgencyAddModal } from "@/components/agencies/AgencyAddModal";
import { createAgency, type AgencyCreateInput } from "@/components/agencies/agencies";

export default function Dashboard() {
  const [addOpen, setAddOpen] = useState(false);

  const handleAdd = useCallback(
    async (input: AgencyCreateInput) => {
      await createAgency(input);
      setAddOpen(false);
      // The dashboard doesn't list agencies directly, so no refresh
      // needed. The Agencies page will refetch on next visit because
      // `AgenciesTable` re-mounts on route change.
    },
    [],
  );

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-foreground">
          Global Dashboard
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-primary-foreground rounded-[12px] px-4 py-2 hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Agency
        </button>
      </div>

      <KpiGrid />
      <GrowthCharts />
      <RecentActivities />

      <AgencyAddModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}