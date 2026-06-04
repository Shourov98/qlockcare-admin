import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { ClientViewModal, Client } from "./ClientViewModal";
import { clients } from "./client";

export function ClientsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const openView = (client: Client) => {
    setSelectedClient(client);
    setViewOpen(true);
  };
  const closeModals = () => {
    setViewOpen(false);
    setSelectedClient(null);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const currentData = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main>
      <table className="w-full text-left text-[14px] text-foreground">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
          <tr>
            <th className="px-6 py-4">SL No.</th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Mobile</th>
            <th className="px-6 py-4">Address</th>
            <th className="px-6 py-4">Guardian</th>
            <th className="px-6 py-4">Guardian Mobile</th>
            <th className="px-6 py-4">Guardian Email</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
              <td className="px-6 py-4 font-medium">{item.sl}</td>
              <td className="px-6 py-4 font-medium">{item.name}</td>
              <td className="px-6 py-4">
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4">{item.mobile}</td>
              <td className="px-6 py-4">{item.address}</td>
              <td className="px-6 py-4">{item.guardianName}</td>
              <td className="px-6 py-4">{item.guardianMobile}</td>
              <td className="px-6 py-4">{item.guardianEmail}</td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button aria-label="View" onClick={() => openView(item)} className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                  <Eye className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-white">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} of {filteredClients.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted/50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-muted/50 transition-colors"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted/50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ClientViewModal
        isOpen={viewOpen}
        client={selectedClient}
        onClose={closeModals}
      />
    </main>
  );
}
