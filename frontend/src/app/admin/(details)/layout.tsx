import { ConfirmProvider } from "@/components/ConfirmProvider";
import { ToastProvider } from "@/lib/toast";

export default function DetailsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConfirmProvider>
            <ToastProvider />
            <div className="min-h-screen bg-gray-50 font-display">
                <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
                    {children}
                </main>
            </div>
        </ConfirmProvider>
    );
}
