import React from "react";
import { X, Download } from "lucide-react";

interface ViewReceiptModalProps {
  item: any;
  onClose: () => void;
  onDownload: () => void;
}

export function ViewReceiptModal({ item, onClose, onDownload }: ViewReceiptModalProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Successful": return "bg-green-100 text-green-700";
      case "Failed": return "bg-red-100 text-red-700";
      case "Refunded": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground">
            Transaction Receipt
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
              <p className="text-foreground font-bold text-lg font-mono">{item.transactionId}</p>
            </div>
            <span className={`text-[12px] font-semibold px-3 py-1 rounded-[100px] inline-block ${getStatusClasses(item.status)}`}>
              {item.status}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Agency</label>
            <p className="text-foreground font-medium">{item.agencyName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-4">
            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <p className="text-foreground font-medium">{item.date}</p>
            </div>
            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <p className="text-foreground font-medium">{item.method}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex justify-between items-center">
            <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
            <p className="text-foreground font-bold text-2xl">{item.amount}</p>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-border text-sm font-medium hover:bg-muted/50 transition-colors text-foreground"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onDownload();
              onClose();
            }}
            className="px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
