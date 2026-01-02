"use client";

import { useSocialSafe } from "@/context/SocialContext";
import Link from "next/link";
import { ReactNode } from "react";

interface WhatsAppLinkProps {
    message?: string;
    className?: string;
    children: ReactNode;
}

export default function WhatsAppLink({ message, className, children }: WhatsAppLinkProps) {
    const { whatsappNumber } = useSocialSafe();

    const href = message
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${whatsappNumber}`;

    return (
        <Link href={href} target="_blank" className={className}>
            {children}
        </Link>
    );
}
