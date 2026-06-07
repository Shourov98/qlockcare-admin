import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface TextEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-shadow">
            <div className="bg-muted/30 border-b border-border p-2 flex flex-wrap items-center gap-1">
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><Bold className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><Italic className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><List className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
            </div>
            <textarea 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-[400px] p-4 bg-background text-sm text-foreground focus:outline-none resize-y"
                placeholder="Start typing your content here..."
            />
        </div>
    );
}
