import React, { useState, useEffect } from "react";
import { Eye, Edit } from "lucide-react";
import { subscriptionsData } from "./billing";
import { Pagination } from "../common/Pagination";
import { ViewSubscriptionModal } from "./ViewSubscriptionModal";
import { EditSubscriptionModal } from "./EditSubscriptionModal";

export function BillingTable({ searchQuery = "", statusFilter = "All Status" }: { searchQuery?: string; statusFilter?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<"view" | "edit" | null>(null);

  const openModal = (item: any, action: "view" | "edit") => {
    setSelectedItem(item);
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedAction(null);
  };

  const filteredSubscriptions = subscriptionsData.filter((sub) => {
    const matchesSearch = sub.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.agencyEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE);
  const currentData = filteredSubscriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Past Due": return "bg-red-100 text-red-700";
      case "Trial": return "bg-blue-100 text-blue-700";
      case "Demo": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="">
      <table className="bg-card w-full text-left text-[14px] overflow-hidden text-foreground rounded-[12px]">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border rounded-[12px]">
          <tr>
            <th className="px-6 py-4">Agency</th>
            <th className="px-6 py-4">Plan</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Billing Cycle</th>
            <th className="px-6 py-4">Next Payment</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 font-medium">{item.agencyName}</td>
              <td className="px-6 py-4">{item.plan}</td>
              <td className="px-6 py-4">
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${getStatusClasses(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">{item.amount}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.billingCycle}</td>
              <td className={`px-6 py-4 ${item.nextPayment.includes("Overdue") ? "text-red-600" : "text-muted-foreground"}`}>
                {item.nextPayment}
              </td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button
                  onClick={() => openModal(item, "view")}
                  aria-label="View"
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModal(item, "edit")}
                  aria-label="Edit"
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSubscriptions.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemName="subscriptions"
      />
      {selectedAction === "view" && selectedItem && (
        <ViewSubscriptionModal item={selectedItem} onClose={closeModal} />
      )}
      {selectedAction === "edit" && selectedItem && (
        <EditSubscriptionModal item={selectedItem} onClose={closeModal} />
      )}
    </main>
  );
}
