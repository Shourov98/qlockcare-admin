"use client";

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiError, apiRequest } from '@/lib/api';

const PASSWORD_HINT =
    'Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.';

function policyErrors(value: string): string[] {
    const errors: string[] = [];
    if (value.length < 12) errors.push('At least 12 characters');
    if (value.length > 128) errors.push('No more than 128 characters');
    if (!/[A-Z]/.test(value)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(value)) errors.push('One lowercase letter');
    if (!/\d/.test(value)) errors.push('One digit');
    if (!/[^A-Za-z0-9]/.test(value)) errors.push('One symbol');
    return errors;
}

export function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const newPolicyErrors = policyErrors(newPassword);
    const mismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
    const canSubmit =
        currentPassword.length > 0 &&
        newPolicyErrors.length === 0 &&
        !mismatch &&
        newPassword === confirmPassword &&
        !submitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        try {
            await apiRequest<void>('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError(err instanceof Error ? err.message : 'Failed to update password');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Security & Password</h3>
                    <p className="text-sm text-muted-foreground">Manage your password and secure your account.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">Account Secure</span>
                </div>
            </div>

            <div className="p-6">
                <form className="max-w-xl space-y-5" onSubmit={handleSubmit}>
                    {success && (
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-700 border border-green-200 rounded-lg p-3 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Password updated successfully. You'll be signed out of other devices shortly.
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="Enter your current password"
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter a new password"
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showNew ? 'Hide new password' : 'Show new password'}
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{PASSWORD_HINT}</p>
                        {newPassword.length > 0 && newPolicyErrors.length > 0 && (
                            <ul className="text-xs text-destructive mt-2 space-y-1">
                                {newPolicyErrors.map((err) => (
                                    <li key={err}>• {err}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your new password"
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {mismatch && (
                            <p className="text-xs text-destructive mt-2">Passwords do not match.</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-border mt-6">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {submitting ? 'Updating…' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}