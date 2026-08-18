import React, { useState } from "react";
import { ApiError } from "@/lib/api";
import type { Agency } from "./agencies";

interface AgencyDeleteModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
  onDelete?: (agencyId: string) => Promise<void>;
}

export function AgencyDeleteModal({
  isOpen,
  agency,
  onClose,
  onDelete,
}: AgencyDeleteModalProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!agency || !onDelete) return;
    setError("");
    setIsSubmitting(true);
    try {
      await onDelete(agency.id);
      onClose();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Unable to delete agency.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Soft-delete agency
        </h2>
        <p className="text-sm">
          Are you sure you want to soft-delete{" "}
          <strong>{agency.name}</strong>? The agency and all dependent rows
          are preserved for foreign-key integrity and audit history; the
          row is hidden from default reads.
        </p>
        {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
        <div className="mt-4 flex justify-end space-x-2">
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
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}