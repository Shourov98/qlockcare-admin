import React from 'react';

interface MissingDocRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    doc: any;
}

export function MissingDocRequestModal({ isOpen, onClose, doc }: MissingDocRequestModalProps) {
    if (!isOpen || !doc) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-card rounded-xl shadow-lg w-[500px] p-6 border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Request Missing Documents</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">To Agency</label>
                        <input type="text" value={doc.agency} disabled className="w-full border border-border rounded-md px-3 py-2 bg-muted text-foreground cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Subject</label>
                        <input type="text" defaultValue={`Action Required: Missing Documents for ${doc.agency}`} className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Message</label>
                        <textarea 
                            rows={4} 
                            defaultValue={`Please review and upload the following missing documents to maintain compliance:\n\n- ${doc.missingList.split(', ').join('\n- ')}\n\nThank you.`}
                            className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">Send Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
