import React, { useState, useEffect, useCallback } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  Agency,
  AgencyStatus,
  createAgency,
  listAgencies,
  softDeleteAgency,
  updateAgency,
  type AgencyCreateInput,
  type AgencyUpdateInput,
} from "./agencies";
import { AgencyViewModal } from "./AgencyViewModal";
import { AgencyEditModal } from "./AgencyEditModal";
import { AgencyDeleteModal } from "./AgencyDeleteModal";
import { AgencyAddModal } from "./AgencyAddModal";
import { Pagination } from "../common/Pagination";
import { ApiError } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

// Color palettes match the rest of the admin UI:
//   ACTIVE       → green
//   TRIAL        → blue
//   SUSPENDED    → red
//   CHURNED      → slate
//   BASIC plan   → slate
//   PRO plan     → blue
//   ENTERPRISE   → purple
const STATUS_STYLES: Record<AgencyStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIAL: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  CHURNED: "bg-slate-100 text-slate-600",
};

const PLAN_STYLES: Record<Agency["subscriptionPlan"], string> = {
  BASIC: "bg-slate-100 text-slate-700",
  PROFESSIONAL: "bg-blue-100 text-blue-700",
  ENTERPRISE: "bg-purple-100 text-purple-700",
};

interface AgenciesTableProps {
  searchQuery?: string;
  statusFilter?: AgencyStatus | "";
}

export function AgenciesTable({
  searchQuery = "",
  statusFilter = "",
}: AgenciesTableProps) {
  const [rows, setRows] = useState<Agency[]>([]);
  const [selected, setSelected] = useState<Agency | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await listAgencies({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: searchQuery,
        statusFilter: statusFilter ? (statusFilter as AgencyStatus) : undefined,
      });
      setRows(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(Math.max(result.pagination.total_pages, 1));
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Unable to load agencies.",
      );
      setRows([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const openView = (agency: Agency) => {
    setSelected(agency);
    setViewOpen(true);
  };
  const openEdit = (agency: Agency) => {
    setSelected(agency);
    setEditOpen(true);
  };
  const openDelete = (agency: Agency) => {
    setSelected(agency);
    setDeleteOpen(true);
  };
  const openAdd = () => setAddOpen(true);
  const closeModals = () => {
    setViewOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setAddOpen(false);
    setSelected(null);
  };

  const handleAdd = async (input: AgencyCreateInput) => {
    await createAgency(input);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      await load();
    }
  };

  const handleEdit = async (id: string, input: AgencyUpdateInput) => {
    const updated = await updateAgency(id, input);
    setRows((current) => current.map((a) => (a.id === id ? updated : a)));
    setSelected(updated);
  };

  const handleDelete = async (id: string) => {
    await softDeleteAgency(id);
    const nextTotal = Math.max(totalItems - 1, 0);
    const nextTotalPages = Math.max(
      Math.ceil(nextTotal / ITEMS_PER_PAGE),
      1,
    );
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
      return;
    }
    await load();
  };

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-bold text-foreground">
          Agencies List
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Agency
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="px-6 py-4 border-b border-border bg-red-50 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-foreground">
            <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Trial ends</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    Loading agencies...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No agencies match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((agency) => (
                  <tr
                    key={agency.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
                  >
                    <td className="px-6 py-4 font-medium">{agency.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${STATUS_STYLES[agency.status]}`}
                      >
                        {agency.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${PLAN_STYLES[agency.subscriptionPlan]}`}
                      >
                        {agency.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {agency.subscriptionPriceDisplay}
                      <span className="text-xs ml-1 text-muted-foreground/70">
                        /{agency.billingCycle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {agency.isTrialing
                        ? new Date(agency.trialEndsAt || "")
                            .toISOString()
                            .split("T")[0]
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {agency.createdAt}
                    </td>
                    <td className="px-6 py-4 flex space-x-2 justify-center">
                      <button
                        aria-label="View"
                        onClick={() => openView(agency)}
                        className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        aria-label="Edit"
                        onClick={() => openEdit(agency)}
                        className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        aria-label="Delete"
                        onClick={() => openDelete(agency)}
                        className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="agencies"
        />
      </div>

      <AgencyViewModal
        isOpen={viewOpen}
        agency={selected}
        onClose={closeModals}
      />
      <AgencyEditModal
        key={`edit-${selected?.id || "none"}`}
        isOpen={editOpen}
        agency={selected}
        onClose={closeModals}
        onEdit={handleEdit}
      />
      <AgencyDeleteModal
        key={`delete-${selected?.id || "none"}`}
        isOpen={deleteOpen}
        agency={selected}
        onClose={closeModals}
        onDelete={handleDelete}
      />
      <AgencyAddModal isOpen={addOpen} onClose={closeModals} onAdd={handleAdd} />
    </main>
  );
}