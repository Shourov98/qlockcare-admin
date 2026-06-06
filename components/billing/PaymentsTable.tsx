import React, { useState, useEffect } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { paymentsData } from "./billing";
import { Pagination } from "../common/Pagination";
import { ViewReceiptModal } from "./ViewReceiptModal";
import { RefundModal } from "./RefundModal";

export function PaymentsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<"receipt" | "refund" | null>(null);

  const openModal = (item: any, action: "receipt" | "refund") => {
    setSelectedItem(item);
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedAction(null);
  };

  const handleDownloadReceipt = (item: any) => {
    const content = `RECEIPT\n\nTransaction ID: ${item.transactionId}\nAgency: ${item.agencyName}\nAmount Paid: ${item.amount}\nDate: ${item.date}\nPayment Method: ${item.method}\nStatus: ${item.status}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Receipt_${item.transactionId}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmRefund = () => {
    console.log("Refund issued for", selectedItem?.transactionId);
  };

  const filteredPayments = paymentsData.filter((pay) =>
    pay.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const currentData = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Successful": return "bg-green-100 text-green-700";
      case "Failed": return "bg-red-100 text-red-700";
      case "Refunded": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
      <table className="w-full text-left text-[14px] text-foreground">
        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
          <tr>
            <th className="px-6 py-4">Transaction ID</th>
            <th className="px-6 py-4">Agency</th>
            <th className="px-6 py-4">Method</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 font-medium">{item.transactionId}</td>
              <td className="px-6 py-4">{item.agencyName}</td>
              <td className="px-6 py-4">{item.method}</td>
              <td className="px-6 py-4 font-semibold">{item.amount}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
              <td className="px-6 py-4">
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${getStatusClasses(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 flex space-x-2 justify-center">
                <button
                  onClick={() => openModal(item, "receipt")}
                  aria-label="Receipt"
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                >
                  <Download className="w-5 h-5" />
                </button>
                {item.status === "Successful" && (
                  <button
                    onClick={() => openModal(item, "refund")}
                    aria-label="Refund"
                    className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground"
                  >
                    <RefreshCcw className="w-5 h-5" />
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
        totalItems={filteredPayments.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemName="transactions"
      />
      {selectedAction === "receipt" && selectedItem && (
        <ViewReceiptModal
          item={selectedItem}
          onClose={closeModal}
          onDownload={() => handleDownloadReceipt(selectedItem)}
        />
      )}
      {selectedAction === "refund" && selectedItem && (
        <RefundModal
          item={selectedItem}
          onClose={closeModal}
          onConfirm={handleConfirmRefund}
        />
      )}
    </main>
  );
}
