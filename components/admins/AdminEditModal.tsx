import React, { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  Admin,
  AdminScope,
  AdminStatus,
  AdminUpdateInput,
} from "./admins";

// Same shape as AdminAddModal so the two modals stay visually consistent.
// If we add a fourth scope, mirror the change in AdminAddModal.tsx and
// SCOPE_LABEL/SCOPE_DESCRIPTION in admins.ts.
const SCOPE_OPTIONS: { value: AdminScope; label: string; description: string }[] = [
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

interface AdminEditModalProps {
  isOpen: boolean;
  admin: Admin | null;
  onClose: () => void;
  onEdit?: (adminId: string, input: AdminUpdateInput) => Promise<void>;
}

export function AdminEditModal({ isOpen, admin, onClose, onEdit }: AdminEditModalProps) {
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [phone, setPhone] = useState(admin?.phone || "");
  const [status, setStatus] = useState<AdminStatus>(admin?.status || "ACTIVE");
  const [scopes, setScopes] = useState<Set<AdminScope>>(
    new Set(admin?.scopes || []),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-sync local state when a different admin is loaded into the modal.
  // AdminsTable already keys this component by admin id, but doing this
  // explicitly keeps the form correct even if the parent forgets to remount.
  useEffect(() => {
    if (!admin) return;
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone || "");
    setStatus(admin.status);
    setScopes(new Set(admin.scopes));
    setError("");
  }, [admin]);

  const toggleScope = (scope: AdminScope) => {
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
    if (!admin || !onEdit) return;

    // PLATFORM_ADMIN rows must always have at least one scope; SUPER_ADMIN
    // rows have no scopes and should never reach this branch.
    if (admin.role === "PLATFORM_ADMIN" && scopes.size === 0) {
      setError("Pick at least one scope.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      // Only send scopes if they actually changed — the backend diffs the
      // incoming list against admin_scopes and writes inserts/deletes.
      // Sending an identical array would be a harmless no-op but the diff
      // is clearer in audit logs when we only PATCH what changed.
      const originalScopes = new Set(admin.scopes);
      const scopesChanged =
        scopes.size !== originalScopes.size ||
        Array.from(scopes).some((s) => !originalScopes.has(s));

      const input: AdminUpdateInput = {
        name,
        email,
        phone,
        status,
      };
      if (admin.role === "PLATFORM_ADMIN" && scopesChanged) {
        input.scopes = Array.from(scopes);
      }

      await onEdit(admin.id, input);
      onClose();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to save admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[28rem] p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Edit Admin</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Updating {admin.email}.{" "}
          {admin.role === "SUPER_ADMIN"
            ? "Super admins hold every scope implicitly — there's nothing to grant here."
            : "Toggle the scopes this platform admin should hold."}
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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminStatus)}
              className="w-full border rounded px-2 py-1 bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="LOCKED">Locked</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          {admin.role === "PLATFORM_ADMIN" ? (
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
          ) : null}
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
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}