import React, { useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { AgencyViewModal, Agency } from "./AgencyViewModal";
import { AgencyEditModal } from "./AgencyEditModal";
import { AgencyDeleteModal } from "./AgencyDeleteModal";


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
  const agencies = [
    { name: "QLOCKCARE", status: "Active", employeeCount: 150, services: "PCA,245D,ARMHS,Counseling", createdAt: "2023-01-15" },
    { name: "HealthCare Plus", status: "Inactive", employeeCount: 245, services: "PCA", createdAt: "2022-09-03" },
    { name: "Premier Care", status: "Active", employeeCount: 98, services: "PCA,245D,ARMHS", createdAt: "2023-05-22" },
    { name: "CareFirst Agency", status: "Active", employeeCount: 187, services: "ARMHS,Counseling", createdAt: "2024-02-08" },
    { name: "Wellness Solutions", status: "Active", employeeCount: 76, services: "245D,ARMHS,Counseling", createdAt: "2023-11-12" },
    { name: "MediAssist", status: "Inactive", employeeCount: 321, services: "PCA,245D,ARMHS,Counseling", createdAt: "2021-07-19" },
    { name: "HealthBridge", status: "Active", employeeCount: 112, services: "PCA,245D,ARMHS", createdAt: "2022-03-05" },
    { name: "CareLink", status: "Pending", employeeCount: 10, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-01-20" },
    { name: "Synergy HomeCare", status: "Active", employeeCount: 67, services: "PCA,245D", createdAt: "2023-08-30" },
    { name: "Gentle Hands Care", status: "Pending", employeeCount: 15, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-02-15" },
    { name: "BrightStar Care", status: "Inactive", employeeCount: 210, services: "PCA", createdAt: "2022-04-10" },
    { name: "HomeWell Health", status: "Active", employeeCount: 89, services: "PCA,245D,ARMHS", createdAt: "2023-03-25" },
    { name: "Allure Home Care", status: "Active", employeeCount: 43, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-01-05" },
    { name: "Prestige Care Services", status: "Pending", employeeCount: 22, services: "PCA,245D", createdAt: "2024-02-20" },
    { name: "Quality Homecare", status: "Active", employeeCount: 58, services: "PCA", createdAt: "2022-11-18" },
  ];
  const filteredAgencies = agencies.filter((agency) => 
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <table className="w-full text-left text-[14px] text-foreground">
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
          {filteredAgencies.map((item, idx) => (
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
