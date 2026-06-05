import React from "react";
import { X } from "lucide-react";

interface PlanModalProps {
  item: any;
  onClose: () => void;
  onSave: () => void;
}

export function PlanModal({ item, onClose, onSave }: PlanModalProps) {
  const isEditing = !!item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground">
            {isEditing ? "Edit Plan" : "Add New Plan"}
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
            <label className="text-sm font-medium text-muted-foreground">Plan Name</label>
            <input 
              type="text" 
              defaultValue={item?.name || ""} 
              placeholder="e.g. Starter"
              className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Price</label>
            <input 
              type="text" 
              defaultValue={item?.price || ""} 
              placeholder="e.g. $49/mo"
              className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Features (one per line)</label>
            <textarea 
              rows={4}
              defaultValue={item?.features?.join("\n") || ""} 
              placeholder="Up to 5 clients&#10;Basic analytics&#10;Email support"
              className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            />
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
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {isEditing ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
