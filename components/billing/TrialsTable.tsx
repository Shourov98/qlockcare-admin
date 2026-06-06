import React, { useState, useEffect } from "react";
import { Mail, ShieldAlert } from "lucide-react";
import { trialsData } from "./billing";
import { Pagination } from "../common/Pagination";
import { SendEmailModal } from "./SendEmailModal";
import { EndTrialModal } from "./EndTrialModal";

export function TrialsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<"email" | "end" | null>(null);

  const openModal = (item: any, action: "email" | "end") => {
    setSelectedItem(item);
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedAction(null);
  };

  const handleSendEmail = (subject: string, message: string) => {
    console.log("Email sent to", selectedItem?.agencyName, { subject, message });
  };

  const handleEndTrial = () => {
    console.log("Ended trial for", selectedItem?.agencyName);
  };

  const filteredTrials = trialsData.filter((trial) =>
    trial.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTrials.length / ITEMS_PER_PAGE);
  const currentData = filteredTrials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
      <table className="w-full text-left text-[14px] text-foreground">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
          <tr>
            <th className="px-6 py-4">Agency</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Start Date</th>
            <th className="px-6 py-4">End Date</th>
            <th className="px-6 py-4">Days Left</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 font-medium">{item.agencyName}</td>
              <td className="px-6 py-4">{item.type}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.startDate}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.endDate}</td>
              <td className={`px-6 py-4 font-semibold ${item.daysLeft <= 3 ? 'text-red-600' : ''}`}>
                {item.daysLeft} days
              </td>
              <td className="px-6 py-4">
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${getStatusClasses(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button
                  onClick={() => openModal(item, "email")}
                  aria-label="Send Email"
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                >
                  <Mail className="w-5 h-5" />
                </button>
                {item.status === "Active" && (
                  <button
                    onClick={() => openModal(item, "end")}
                    aria-label="End Trial"
                    className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground0"
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTrials.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemName="trials"
      />

      {/* Modals */}
      {selectedAction === "email" && selectedItem && (
        <SendEmailModal
          item={selectedItem}
          onClose={closeModal}
          onSend={handleSendEmail}
        />
      )}
      {selectedAction === "end" && selectedItem && (
        <EndTrialModal
          item={selectedItem}
          onClose={closeModal}
          onConfirm={handleEndTrial}
        />
      )}
    </main>
  );
}
