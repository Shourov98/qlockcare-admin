"use client";

import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, MessageSquare, ShieldAlert, FileText, Check, CheckCheck } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'alert',
        title: 'Critical System Alert',
        message: 'Database connection pool is nearing capacity (92%). Please monitor.',
        time: '10 mins ago',
        read: false,
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100',
        actionLabel: 'View Metrics',
    },
    {
        id: 3,
        type: 'document',
        title: 'New Document Uploaded',
        message: 'Digital Solutions Inc has uploaded their missing Q3 Financial Report.',
        time: '3 hours ago',
        read: true,
        icon: FileText,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-100',
        actionLabel: 'Review Document',
    },
    {
        id: 4,
        type: 'compliance',
        title: 'Compliance Warning',
        message: 'Creative Hub has 3 compliance licenses expiring in less than 7 days.',
        time: '5 hours ago',
        read: true,
        icon: ShieldAlert,
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        actionLabel: 'View Licenses',
    },
    {
        id: 5,
        type: 'system',
        title: 'System Update Completed',
        message: 'Version 2.4.1 has been successfully deployed. No downtime was recorded.',
        time: '1 day ago',
        read: true,
        icon: CheckCircle2,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        actionLabel: 'Release Notes',
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <main className="p-5 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Bell className="w-6 h-6 text-primary" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                                {unreadCount} New
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Stay updated with system alerts, tickets, and mentions.</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 font-medium text-sm rounded-lg transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-6 px-6 border-b border-border bg-muted/10">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-4 text-sm font-medium transition-colors border-b-2 ${filter === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`py-4 text-sm font-medium transition-colors border-b-2 ${filter === 'unread' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Unread
                    </button>
                </div>

                <div className="flex flex-col divide-y divide-border">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">You're all caught up!</h3>
                            <p className="text-muted-foreground text-sm">No new notifications in this category.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div 
                                    key={notification.id} 
                                    className={`p-6 flex gap-4 transition-colors hover:bg-muted/30 ${!notification.read ? 'bg-primary/5' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${notification.iconBg} ${notification.iconColor}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4 mb-1">
                                            <h4 className={`text-base truncate ${!notification.read ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0 mt-1">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm mb-3 ${!notification.read ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                                {notification.actionLabel}
                                            </button>
                                            {!notification.read && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-3"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    );
}
