import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

interface MissingDocViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    doc: any;
}

export function MissingDocViewModal({ isOpen, onClose, doc }: MissingDocViewModalProps) {
    if (!isOpen || !doc) return null;

    const missingItems = doc.missingList.split(', ');

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-card rounded-xl shadow-lg w-[450px] p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Missing Document Details</h2>
                        <p className="text-sm text-muted-foreground">{doc.agency}</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Documents Required ({doc.missingCount})</h4>
                        <ul className="space-y-2">
                            {missingItems.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">Close</button>
                </div>
            </div>
        </div>
    );
}
