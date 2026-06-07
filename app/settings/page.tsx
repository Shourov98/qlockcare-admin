"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, FileText, Info } from 'lucide-react';
import { ProfileSettings } from '../../components/settings/ProfileSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { PrivacyPolicy } from '../../components/settings/PrivacyPolicy';
import { TermsConditions } from '../../components/settings/TermsConditions';
import { AboutUs } from '../../components/settings/AboutUs';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy' | 'terms' | 'about'>('profile');

    return (
        <main className="p-5 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                        Global Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your account settings, security, and notification preferences.</p>
                </div>
            </div>

            <div className="border-b border-border">
                <div className="flex items-center gap-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <Lock className="w-4 h-4" /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <Bell className="w-4 h-4" /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'privacy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <Shield className="w-4 h-4" /> Privacy Policy
                    </button>
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'terms' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <FileText className="w-4 h-4" /> Terms & Conditions
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === 'about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                        <Info className="w-4 h-4" /> About Us
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'privacy' && <PrivacyPolicy />}
                {activeTab === 'terms' && <TermsConditions />}
                {activeTab === 'about' && <AboutUs />}
            </div>
        </main>
    );
}
