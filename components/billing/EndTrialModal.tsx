import React from "react";
import { X, ShieldAlert } from "lucide-react";

interface EndTrialModalProps {
  item: any;
  onClose: () => void;
  onConfirm: () => void;
}

export function EndTrialModal({ item, onClose, onConfirm }: EndTrialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            End Trial Early
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to end the {item.type.toLowerCase()} for <strong className="text-foreground">{item.agencyName}</strong>? 
            They currently have {item.daysLeft} days remaining. This will immediately revoke their access.
          </p>
        </div>

        <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-border text-sm font-medium hover:bg-muted/50 transition-colors text-foreground"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-[8px] bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            End Trial
          </button>
        </div>
      </div>
    </div>
  );
}
