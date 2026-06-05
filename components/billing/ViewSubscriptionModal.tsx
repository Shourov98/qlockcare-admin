import React from "react";
import { X } from "lucide-react";

interface ViewSubscriptionModalProps {
  item: any;
  onClose: () => void;
}

export function ViewSubscriptionModal({ item, onClose }: ViewSubscriptionModalProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Past Due": return "bg-yellow-100 text-yellow-700";
      case "Trial": return "bg-blue-100 text-blue-700";
      case "Demo": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground">
            Subscription Details
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Agency Name</label>
            <p className="text-foreground font-medium">{item.agencyName}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <p className="text-foreground font-medium">{item.agencyEmail}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Plan</label>
              <p className="text-foreground font-medium">{item.plan}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] inline-block ${getStatusClasses(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <p className="text-foreground font-medium">{item.amount}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Billing Cycle</label>
              <p className="text-foreground font-medium">{item.billingCycle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
