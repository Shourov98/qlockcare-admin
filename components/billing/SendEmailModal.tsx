import React, { useState } from "react";
import { X, Send } from "lucide-react";

interface SendEmailModalProps {
  item: any;
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
}

export function SendEmailModal({ item, onClose, onSend }: SendEmailModalProps) {
  const [subject, setSubject] = useState(`Regarding your ${item.type} account`);
  const [message, setMessage] = useState(`Hi ${item.agencyName} team,\n\nWe noticed you have ${item.daysLeft} days left in your ${item.type.toLowerCase()}. Please let us know if you have any questions!\n\nBest,\nFarhan Salad Admin`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h3 className="text-xl font-bold text-foreground">
            Compose Email
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <input 
              type="text" 
              readOnly 
              value={`${item.agencyName} (Trial Account)`} 
              className="w-full border border-border rounded-[8px] px-3 py-2 bg-muted/20 text-muted-foreground focus:outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-border rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Message</label>
            <textarea 
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              onSend(subject, message);
              onClose();
            }}
            className="px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
