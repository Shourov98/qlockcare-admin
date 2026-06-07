"use client";

import React, { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { TextEditor } from '../common/TextEditor';

export function TermsConditions() {
    const [content, setContent] = useState(`1. Agreement to Terms

By accessing or using our services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.

2. Use License

Permission is granted to temporarily download one copy of the materials (information or software) on Farhan Salad HQ's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- Modify or copy the materials;
- Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
- Attempt to decompile or reverse engineer any software contained on our website;
- Remove any copyright or other proprietary notations from the materials; or
- Transfer the materials to another person or "mirror" the materials on any other server.

3. Disclaimer

The materials on our website are provided on an 'as is' basis. Farhan Salad HQ makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. Limitations

In no event shall Farhan Salad HQ or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if Farhan Salad HQ or a authorized representative has been notified orally or in writing of the possibility of such damage.`);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Terms and Conditions</h3>
                        <p className="text-sm text-muted-foreground">Edit the terms and conditions content below.</p>
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
