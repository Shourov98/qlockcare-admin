import React from "react";

interface ComplianceLicenseAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComplianceLicenseAddModal({ isOpen, onClose }: ComplianceLicenseAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-card rounded-xl shadow-lg w-[400px] p-6 border border-border">
        <h2 className="text-xl font-bold mb-4 text-foreground">Add Document / License</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Agency</label>
            <input type="text" placeholder="Enter agency name" className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Document Type</label>
            <select className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="License">License</option>
              <option value="Certificate">Certificate</option>
              <option value="Document">Document</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Document Name</label>
            <input type="text" placeholder="e.g. State Insurance License" className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Expiry Date</label>
            <input type="date" className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">Add Document</button>
          </div>
        </form>
      </div>
    </div>
  );
}
