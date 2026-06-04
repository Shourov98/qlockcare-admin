import React from "react";
import { Agency } from "./AgencyViewModal";

interface AgencyDeleteModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
}

export function AgencyDeleteModal({ isOpen, agency, onClose }: AgencyDeleteModalProps) {
  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
        <p>Are you sure you want to delete <strong>{agency.name}</strong>?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors">Cancel</button>
          <button onClick={() => { /* Placeholder for delete logic */ onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}
