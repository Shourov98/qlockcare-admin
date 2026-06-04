import React from "react";

export type Agency = {
  name: string;
  status: string;
  employeeCount: number;
  services: string;
  createdAt: string;
};

interface AgencyViewModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
}

export function AgencyViewModal({ isOpen, agency, onClose }: AgencyViewModalProps) {
  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Agency Details</h2>
        <p><strong>Name:</strong> {agency.name}</p>
        <p><strong>Status:</strong> {agency.status}</p>
        <p><strong>Employees:</strong> {agency.employeeCount}</p>
        <p><strong>Services:</strong> {agency.services}</p>
        <p><strong>Created At:</strong> {agency.createdAt}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
