"use client";

import { createContext, useContext, ReactNode } from "react";

interface SocialContextType {
    whatsappNumber: string;
}

const SocialContext = createContext<SocialContextType | null>(null);

interface SocialProviderProps {
    children: ReactNode;
    whatsappNumber: string;
}

export function SocialProvider({ children, whatsappNumber }: SocialProviderProps) {
    return (
        <SocialContext.Provider value={{ whatsappNumber }}>
            {children}
        </SocialContext.Provider>
    );
}

export function useSocial() {
    const context = useContext(SocialContext);
    if (!context) {
        throw new Error("useSocial must be used within a SocialProvider");
    }
    return context;
}

// Safe version that returns default if not in provider
export function useSocialSafe() {
    const context = useContext(SocialContext);
    return context || { whatsappNumber: "" };
}
