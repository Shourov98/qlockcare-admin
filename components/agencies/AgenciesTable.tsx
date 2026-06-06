import React, { useState, useEffect } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { AgencyViewModal, Agency } from "./AgencyViewModal";
import { agencies } from "./agencies";
import { AgencyEditModal } from "./AgencyEditModal";
import { AgencyDeleteModal } from "./AgencyDeleteModal";
import { Pagination } from "../common/Pagination";


export function AgenciesTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openView = (agency: Agency) => {
    setSelectedAgency(agency);
    setViewOpen(true);
  };
  const openEdit = (agency: Agency) => {
    setSelectedAgency(agency);
    setEditOpen(true);
  };
  const openDelete = (agency: Agency) => {
    setSelectedAgency(agency);
    setDeleteOpen(true);
  };
  const closeModals = () => {
    setViewOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedAgency(null);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const currentData = filteredAgencies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main>
      <table className="bg-card w-full text-left text-[14px] text-foreground rounded-[12px] overflow-hidden">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
          <tr>
            <th className="px-6 py-4">Agency</th>
            <th className="px-6 py-4">Staff</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Services</th>
            <th className="px-6 py-4">Created On</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
              <td className="px-6 py-4 font-medium">{item.name}</td>
              <td className="px-6 py-4">
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">{item.employeeCount}</td>
              <td className="px-6 py-4">{item.services}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.createdAt}</td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button aria-label="View" onClick={() => openView(item)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                  <Eye className="w-5 h-5" />
                </button>
                <button aria-label="Edit" onClick={() => openEdit(item)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                  <Edit className="w-5 h-5" />
                </button>
                <button aria-label="Delete" onClick={() => openDelete(item)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAgencies.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemName="entries"
      />

      <AgencyViewModal
        isOpen={viewOpen}
        agency={selectedAgency}
        onClose={closeModals}
      />
      <AgencyEditModal
        isOpen={editOpen}
        agency={selectedAgency}
        onClose={closeModals}
      />
      <AgencyDeleteModal
        isOpen={deleteOpen}
        agency={selectedAgency}
        onClose={closeModals}
      />
    </main>
  );
}
