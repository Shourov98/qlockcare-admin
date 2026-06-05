import React, { useState, useEffect } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { paymentsData } from "./billing";
import { Pagination } from "../common/Pagination";

export function PaymentsTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
    <main>
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
                <button aria-label="Receipt" className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                  <Download className="w-5 h-5" />
                </button>
                {item.status === "Successful" && (
                  <button aria-label="Refund" className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
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
    </main>
  );
}
