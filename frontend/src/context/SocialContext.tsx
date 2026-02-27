"use client";

import { createContext, ReactNode, useContext } from "react";

interface SocialContextType {
    whatsappNumber: string;
    whatsappMessage: string;
}

const SocialContext = createContext<SocialContextType | null>(null);

interface SocialProviderProps {
    children: ReactNode;
    whatsappNumber: string;
    whatsappMessage: string;
}

export function SocialProvider({ children, whatsappNumber, whatsappMessage }: SocialProviderProps) {
    const sanitizedWhatsAppNumber = whatsappNumber.replace(/\D/g, "");
    const sanitizedWhatsAppMessage = whatsappMessage.trim();

    return (
        <SocialContext.Provider value={{ whatsappNumber: sanitizedWhatsAppNumber, whatsappMessage: sanitizedWhatsAppMessage }}>
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
    return context || { whatsappNumber: "", whatsappMessage: "" };
}
