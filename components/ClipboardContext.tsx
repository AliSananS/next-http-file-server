// clipboard-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type ClipboardItem = {
    path: string;
    type?: 'file' | 'dir';
};

type ClipboardContextType = {
    item: ClipboardItem | null;
    copy: (item: ClipboardItem) => void;
    clear: () => void;
};

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
    const [item, setItem] = useState<ClipboardItem | null>(null);

    const copy = (item: ClipboardItem) => setItem(item);
    const clear = () => setItem(null);

    return (
        <ClipboardContext.Provider value={{ item, copy, clear }}>
            {children}
        </ClipboardContext.Provider>
    );
}

export function useClipboard() {
    const context = useContext(ClipboardContext);
    if (!context) throw new Error('useClipboard must be used within ClipboardProvider');
    return context;
}
