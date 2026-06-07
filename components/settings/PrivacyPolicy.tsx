"use client";

import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';
import { TextEditor } from '../common/TextEditor';

export function PrivacyPolicy() {
    const [content, setContent] = useState(`1. Information We Collect

We collect information that you provide directly to us, including but not limited to your name, email address, phone number, and any other information you choose to provide when creating an account or interacting with our services.

We also automatically collect certain information about your device and how you interact with our services, such as your IP address, browser type, and usage data.

2. How We Use Your Information

We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send you technical notices, updates, security alerts, and support messages
- Respond to your comments, questions, and requests

3. Data Security

We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.

4. Contact Us

If you have questions or comments about this Privacy Policy, please contact us at privacy@farhansalad.com.`);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Privacy Policy</h3>
                        <p className="text-sm text-muted-foreground">Edit the privacy policy content below.</p>
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
