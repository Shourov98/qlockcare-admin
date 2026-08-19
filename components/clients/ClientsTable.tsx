"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye } from "lucide-react";
import {
  listClients,
  patientStatusLabel,
  patientStatusStyle,
  type Patient,
  type PatientStatus,
} from "./client";
import { ClientViewModal } from "./ClientViewModal";
import { Pagination } from "../common/Pagination";

const ITEMS_PER_PAGE = 10;

// "Clients List" table on /users.
//
// Previously rendered a 25-row hardcoded array (Acme Corp, Beta
// Health, …) — the rows never reflected real customers. Now reads the
// cross-tenant `/admin/people/patients` endpoint with pagination,
// filters by `searchQuery` and `statusFilter`.
//
// The "Guardian" columns used to be invented per row; the cross-tenant
// backend doesn't expose per-patient guardians. We replace those with
// the patient_code + agency name (real data) and drop the fake
// guardian columns until the cross-tenant guardian API ships.
export function ClientsTable({
  searchQuery = "",
  statusFilter = "",
}: {
  searchQuery?: string;
  statusFilter?: "" | PatientStatus;
}) {
  const [rows, setRows] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listClients({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: searchQuery,
        ...(statusFilter ? { statusFilter } : {}),
      });
      setRows(result.data);
      setTotalItems(result.pagination.total);
    } catch (caught) {
      if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError("Unable to load clients.");
      }
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Reset to first page whenever the filter changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(Math.ceil(totalItems / ITEMS_PER_PAGE), 1);

  return (
    <main className="rounded-[12px] overflow-hidden">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3">
          {error}
        </div>
      ) : null}
      <table className="w-full text-left text-[14px] text-foreground rounded-[12px] bg-card overflow-hidden">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
          <tr>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Agency</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Admitted</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                Loading clients…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                No clients match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
              >
                <td className="px-6 py-4 font-mono text-xs">
                  {client.patient_code}
                </td>
                <td className="px-6 py-4 font-medium">
                  {client.full_name ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${patientStatusStyle(client.status)}`}
                  >
                    {patientStatusLabel(client.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {client.agency_name ?? "—"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {client.email ?? "—"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {client.phone ?? "—"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {client.admitted_at
                    ? new Date(client.admitted_at).toISOString().split("T")[0]
                    : "—"}
                </td>
                <td className="px-6 py-4 flex space-x-2 justify-center">
                  <button
                    aria-label="View"
                    onClick={() => {
                      setSelected(client);
                      setViewOpen(true);
                    }}
                    className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="clients"
        />
      )}

      <ClientViewModal
        isOpen={viewOpen}
        client={selected}
        onClose={() => {
          setViewOpen(false);
          setSelected(null);
        }}
      />
    </main>
  );
}