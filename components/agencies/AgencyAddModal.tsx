import React from "react";

interface AgencyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgencyAddModal({ isOpen, onClose }: AgencyAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Add Agency</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Placeholder for save logic */ onClose(); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" placeholder="Enter agency name" className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full border rounded px-2 py-1 bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employees</label>
            <input type="number" placeholder="Number of employees" className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Services</label>
            <input type="text" placeholder="e.g. PCA, 245D" className="w-full border rounded px-2 py-1" />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
