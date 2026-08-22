import React, { useState } from "react";
import { AdminCreateInput } from "./admins";
import { ApiError } from "@/lib/api";

// Available scopes mirror the backend's AdminScope enum. Adding a new
// scope on the backend requires adding it here too — the only other
// change is to the backend CHECK constraint in migration 0024.
const SCOPE_OPTIONS: { value: "AGENCIES" | "CLINICAL" | "SUPPORT"; label: string; description: string }[] = [
  {
    value: "AGENCIES",
    label: "Agencies",
    description: "View and update agency status, plan, suspension across all tenants.",
  },
  {
    value: "CLINICAL",
    label: "Clinical",
    description: "View clients and staff across all tenants (read-only).",
  },
  {
    value: "SUPPORT",
    label: "Support",
    description: "View audit logs and notifications across all tenants.",
  },
];

interface AdminAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (admin: AdminCreateInput) => Promise<void>;
}

export function AdminAddModal({ isOpen, onClose, onAdd }: AdminAddModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [scopes, setScopes] = useState<Set<"AGENCIES" | "CLINICAL" | "SUPPORT">>(
    new Set(),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleScope = (scope: "AGENCIES" | "CLINICAL" | "SUPPORT") => {
    setScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) {
        next.delete(scope);
      } else {
        next.add(scope);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdd) return;

    if (scopes.size === 0) {
      setError("Pick at least one scope.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onAdd({
        name,
        email,
        phone,
        scopes: Array.from(scopes),
      });
      setName("");
      setEmail("");
      setPhone("");
      setScopes(new Set());
      onClose();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to add admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[28rem] p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Add Platform Admin</h2>
        <p className="text-sm text-muted-foreground mb-4">
          They'll receive an invitation email and choose their own password.
          Pick at least one scope to grant on creation.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Scopes</label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/30"
                >
                  <input
                    type="checkbox"
                    checked={scopes.has(opt.value)}
                    onChange={() => toggleScope(opt.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {opt.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? "Sending invitation..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
