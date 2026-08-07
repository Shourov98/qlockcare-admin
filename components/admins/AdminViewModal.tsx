import React from "react";
import { Admin } from "./admins";

interface AdminViewModalProps {
  isOpen: boolean;
  admin: Admin | null;
  onClose: () => void;
}

export function AdminViewModal({ isOpen, admin, onClose }: AdminViewModalProps) {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Details</h2>
        <dl className="space-y-2">
          <div>
            <dt className="font-medium">Name</dt>
            <dd>{admin.name}</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd>{admin.email}</dd>
          </div>
          <div>
            <dt className="font-medium">Phone</dt>
            <dd>{admin.phone || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium">Status</dt>
            <dd>{admin.status}</dd>
          </div>
          <div>
            <dt className="font-medium">Email Verified</dt>
            <dd>{admin.emailVerified ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="font-medium">Created At</dt>
            <dd>{admin.createdAt}</dd>
          </div>
        </dl>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
