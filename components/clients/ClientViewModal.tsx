import React from "react";

export type Client = {
  name: string;
  status: string;
  email: string;
  mobile: string;
  address: string;
  guardianName: string;
  guardianMobile: string;
  guardianEmail: string;
};

interface ClientViewModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

export function ClientViewModal({ isOpen, client, onClose }: ClientViewModalProps) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Client Details</h2>
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Status:</strong> {client.status}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Mobile:</strong> {client.mobile}</p>
        <p><strong>Address:</strong> {client.address}</p>
        <p><strong>Guardian Name:</strong> {client.guardianName}</p>
        <p><strong>Guardian Mobile:</strong> {client.guardianMobile}</p>
        <p><strong>Guardian Email:</strong> {client.guardianEmail}</p>
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
