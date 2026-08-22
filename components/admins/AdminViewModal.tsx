import React from "react";
import { Admin, SCOPE_LABEL, SCOPE_DESCRIPTION } from "./admins";

interface AdminViewModalProps {
  isOpen: boolean;
  admin: Admin | null;
  onClose: () => void;
}

export function AdminViewModal({ isOpen, admin, onClose }: AdminViewModalProps) {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[28rem] p-6 max-h-[90vh] overflow-y-auto">
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
            <dt className="font-medium">Role</dt>
            <dd>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                admin.role === "SUPER_ADMIN"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}>
                {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Platform Admin"}
              </span>
            </dd>
          </div>
          {admin.role === "PLATFORM_ADMIN" ? (
            <div>
              <dt className="font-medium">Scopes</dt>
              <dd className="mt-1 space-y-2">
                {admin.scopes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No scopes assigned.
                  </p>
                ) : (
                  admin.scopes.map((scope) => (
                    <div key={scope} className="border rounded-md p-2">
                      <div className="text-sm font-semibold">
                        {SCOPE_LABEL[scope]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {SCOPE_DESCRIPTION[scope]}
                      </div>
                    </div>
                  ))
                )}
              </dd>
            </div>
          ) : null}
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
