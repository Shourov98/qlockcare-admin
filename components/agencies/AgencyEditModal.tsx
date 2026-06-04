import React from "react";
import { Agency } from "./AgencyViewModal";

interface AgencyEditModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
}

export function AgencyEditModal({ isOpen, agency, onClose }: AgencyEditModalProps) {
  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Agency</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Placeholder for save logic */ onClose(); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input defaultValue={agency.name} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select defaultValue={agency.status} className="w-full border rounded px-2 py-1 bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employees</label>
            <input type="number" defaultValue={agency.employeeCount} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Services</label>
            <input defaultValue={agency.services} className="w-full border rounded px-2 py-1" />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
