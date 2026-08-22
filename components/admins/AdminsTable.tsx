import React, { useCallback, useEffect, useState } from "react";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import {
  Admin,
  AdminCreateInput,
  AdminUpdateInput,
  createAdmin,
  deleteAdmin,
  listAdmins,
  updateAdmin,
} from "./admins";

import { Pagination } from "../common/Pagination";
import { AdminViewModal } from "./AdminViewModal";
import { AdminEditModal } from "./AdminEditModal";
import { AdminDeleteModal } from "./AdminDeleteModal";
import { AdminAddModal } from "./AdminAddModal";

const ITEMS_PER_PAGE = 10;

export function AdminsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [adminRows, setAdminRows] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await listAdmins({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: searchQuery,
      });
      setAdminRows(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(Math.max(result.pagination.total_pages, 1));
    } catch {
      setError("Unable to load admins.");
      setAdminRows([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAdmins();
  }, [loadAdmins]);

  const openView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setViewOpen(true);
  };
  const openEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditOpen(true);
  };
  const openDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteOpen(true);
  };
  const openAdd = () => {
    setAddOpen(true);
  };
  const closeModals = () => {
    setViewOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setAddOpen(false);
    setSelectedAdmin(null);
  };

  const handleAdd = async (input: AdminCreateInput) => {
    await createAdmin(input);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      await loadAdmins();
    }
  };

  const handleEdit = async (adminId: string, input: AdminUpdateInput) => {
    const updated = await updateAdmin(adminId, input);
    setAdminRows((rows) => rows.map((admin) => (admin.id === adminId ? updated : admin)));
    setSelectedAdmin(updated);
  };

  const handleDelete = async (adminId: string) => {
    await deleteAdmin(adminId);
    const nextTotal = Math.max(totalItems - 1, 0);
    const nextTotalPages = Math.max(Math.ceil(nextTotal / ITEMS_PER_PAGE), 1);
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
      return;
    }
    await loadAdmins();
  };

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-bold">Admins List</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add Admin
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role / Scopes</th>
                <th className="px-6 py-4">Created On</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-muted-foreground" colSpan={6}>
                    Loading admins...
                  </td>
                </tr>
              ) : adminRows.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-muted-foreground" colSpan={6}>
                    No admins found.
                  </td>
                </tr>
              ) : (
                adminRows.map((admin) => (
                <tr key={admin.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                  <td className="px-6 py-4 font-medium">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold w-fit ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Platform Admin"}
                      </span>
                      {admin.role === "PLATFORM_ADMIN" && admin.scopes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {admin.scopes.map((scope) => (
                            <span
                              key={scope}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {admin.role === "PLATFORM_ADMIN" && admin.scopes.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">
                          No scopes assigned
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{admin.createdAt}</td>
                  <td className="px-6 py-4 flex space-x-2 justify-center">
                    <button aria-label="View" onClick={() => openView(admin)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button aria-label="Edit" onClick={() => openEdit(admin)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button aria-label="Delete" onClick={() => openDelete(admin)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
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
          itemName="admins"
        />
      </div>

      <AdminViewModal isOpen={viewOpen} admin={selectedAdmin} onClose={closeModals} />
      <AdminEditModal
        key={`edit-${selectedAdmin?.id || "none"}`}
        isOpen={editOpen}
        admin={selectedAdmin}
        onClose={closeModals}
        onEdit={handleEdit}
      />
      <AdminDeleteModal
        key={`delete-${selectedAdmin?.id || "none"}`}
        isOpen={deleteOpen}
        admin={selectedAdmin}
        onClose={closeModals}
        onDelete={handleDelete}
      />
      <AdminAddModal isOpen={addOpen} onClose={closeModals} onAdd={handleAdd} />
    </main>
  );
}
