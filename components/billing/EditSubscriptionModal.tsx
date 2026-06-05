import React from "react";
import { X } from "lucide-react";

interface EditSubscriptionModalProps {
  item: any;
  onClose: () => void;
}

export function EditSubscriptionModal({ item, onClose }: EditSubscriptionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground">
            Edit Subscription
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
            <input type="text" defaultValue={item.agencyName} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <input type="email" defaultValue={item.agencyEmail} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Plan</label>
              <select defaultValue={item.plan} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <select defaultValue={item.status} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Paid">Paid</option>
                <option value="Past Due">Past Due</option>
                <option value="Trial">Trial</option>
                <option value="Demo">Demo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <input type="text" defaultValue={item.amount} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Billing Cycle</label>
              <input type="text" defaultValue={item.billingCycle} className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-border text-sm font-medium hover:bg-muted/50 transition-colors text-foreground"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
