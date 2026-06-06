import React from "react";
import { Admin } from "./admins";

interface AdminDeleteModalProps {
  isOpen: boolean;
  admin: Admin | null;
  onClose: () => void;
  onDelete?: (adminId: string) => void;
}

export function AdminDeleteModal({ isOpen, admin, onClose, onDelete }: AdminDeleteModalProps) {
  const handleDelete = () => {
    if (admin && onDelete) {
      onDelete(admin.id);
    }
    onClose();
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Admin</h2>
        <p className="mb-4">Are you sure you want to delete <strong>{admin.name}</strong>?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
