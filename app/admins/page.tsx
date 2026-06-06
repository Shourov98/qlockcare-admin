"use client";

import { AdminsTable } from "@/components/admins/AdminsTable";
import React from "react";

export default function AdminsPage() {
  return (
    <main className="p-6 space-y-6">
      {/* <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Admins</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage admin users, view details, and perform CRUD operations.
          </p>
        </div>
      </div> */}
      <AdminsTable />
    </main>
  );
}
