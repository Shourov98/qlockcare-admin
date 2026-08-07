import React from "react";
import { ApiError } from "@/lib/api";
import { Admin } from "./admins";

interface AdminDeleteModalProps {
  isOpen: boolean;
  admin: Admin | null;
  onClose: () => void;
  onDelete?: (adminId: string) => Promise<void>;
}

export function AdminDeleteModal({ isOpen, admin, onClose, onDelete }: AdminDeleteModalProps) {
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!admin || !onDelete) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onDelete(admin.id);
      onClose();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to delete admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Admin</h2>
        <p className="mb-4">Are you sure you want to delete <strong>{admin.name}</strong>?</p>
        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
