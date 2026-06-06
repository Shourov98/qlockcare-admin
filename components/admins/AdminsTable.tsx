import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { admins, Admin } from "./admins";

import { Pagination } from "../common/Pagination";
import { AdminViewModal } from "./AdminViewModal";
import { AdminEditModal } from "./AdminEditModal";
import { AdminDeleteModal } from "./AdminDeleteModal";
import { AdminAddModal } from "./AdminAddModal";

export function AdminsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);
  const currentData = filteredAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-foreground">
            <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Created On</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((admin, idx) => (
                <tr key={admin.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                  <td className="px-6 py-4 font-medium">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.phone}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAdmins.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="admins"
        />
      </div>

      <AdminViewModal isOpen={viewOpen} admin={selectedAdmin} onClose={closeModals} />
      <AdminEditModal isOpen={editOpen} admin={selectedAdmin} onClose={closeModals} />
      <AdminDeleteModal isOpen={deleteOpen} admin={selectedAdmin} onClose={closeModals} />
      <AdminAddModal isOpen={addOpen} onClose={closeModals} />
    </main>
  );
}
