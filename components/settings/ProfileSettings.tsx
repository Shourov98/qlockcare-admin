"use client";

import React, { useState } from 'react';
import { Camera, User, Mail, Phone, Building } from 'lucide-react';

export function ProfileSettings() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
                    <p className="text-sm text-muted-foreground">Update your account profile details and public information.</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium text-sm rounded-lg transition-colors"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-md group">
                            <img src="https://i.pravatar.cc/150?u=admin" alt="Profile" className="w-full h-full object-cover" />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">Change</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-foreground">John Mitchell</h4>
                            <p className="text-sm text-muted-foreground">Super Admin</p>
                        </div>
                    </div>

                    <form className="flex-1 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        defaultValue="John" 
                                        disabled={!isEditing}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        defaultValue="Mitchell" 
                                        disabled={!isEditing}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input 
                                        type="email" 
                                        defaultValue="john.mitchell@admin.com" 
                                        disabled={!isEditing}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input 
                                        type="tel" 
                                        defaultValue="+1 (555) 000-0000" 
                                        disabled={!isEditing}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Organization</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    defaultValue="Farhan Salad HQ" 
                                    disabled={!isEditing}
                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors">
                                    Discard Changes
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
