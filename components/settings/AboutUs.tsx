"use client";

import React, { useState } from 'react';
import { Info, Save } from 'lucide-react';
import { TextEditor } from '../common/TextEditor';

export function AboutUs() {
    const [content, setContent] = useState(`Empowering agencies to scale seamlessly.

Farhan Salad Admin is a comprehensive management platform designed specifically for digital agencies and tech-forward organizations. We believe in simplifying complex workflows so you can focus on what matters most—your clients.

Our Mission
To build intuitive, powerful tools that eliminate administrative overhead for modern teams.

Our Team
A diverse group of passionate engineers, designers, and strategists working globally.

Global Impact
Supporting thousands of agencies across 50+ countries with 99.99% uptime.

Contact Information

Headquarters
123 Tech Boulevard
San Francisco, CA 94105
United States

General Inquiries
hello@farhansalad.com
+1 (555) 123-4567`);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="text-lg font-bold text-foreground">About Us</h3>
                        <p className="text-sm text-muted-foreground">Edit the about us content below.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
            
            <div className="p-6">
                <TextEditor value={content} onChange={setContent} />
            </div>
        </div>
    );
}
