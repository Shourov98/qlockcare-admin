"use client";

import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertCircle } from 'lucide-react';

export function NotificationSettings() {
    const [preferences, setPreferences] = useState({
        emailNewTicket: true,
        emailStatusChange: true,
        emailDailySummary: false,
        pushNewTicket: true,
        pushMentions: true,
        pushMarketing: false
    });

    const togglePref = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-muted'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose what updates you want to receive and how.</p>
                </div>
            </div>

            <div className="p-0">
                {/* Email Notifications */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive updates directly to your inbox.</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="block text-sm font-medium text-foreground">New Support Tickets</span>
                                <span className="text-xs text-muted-foreground">Get notified when a new ticket is assigned to you</span>
                            </div>
                            <ToggleSwitch checked={preferences.emailNewTicket} onChange={() => togglePref('emailNewTicket')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="block text-sm font-medium text-foreground">Ticket Status Changes</span>
                                <span className="text-xs text-muted-foreground">Updates when a ticket's priority or status changes</span>
                            </div>
                            <ToggleSwitch checked={preferences.emailStatusChange} onChange={() => togglePref('emailStatusChange')} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="block text-sm font-medium text-foreground">Daily Summary</span>
                                <span className="text-xs text-muted-foreground">A daily overview of your pending tasks and tickets</span>
                            </div>
                            <ToggleSwitch checked={preferences.emailDailySummary} onChange={() => togglePref('emailDailySummary')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-muted/20 border-t border-border flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Changes to your notification preferences are saved automatically. Note that critical security alerts and billing notifications cannot be disabled and will always be sent to your primary email address.
                </p>
            </div>
        </div>
    );
}
