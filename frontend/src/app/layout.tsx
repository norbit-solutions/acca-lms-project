import AuthProvider from "@/components/AuthProvider";
import { SocialProvider } from "@/context/SocialContext";
import AOSProvider from "@/providers/AOSProvider";
import { cmsService } from "@/services/cmsService";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Learnspire - Master Your Learning Journey",
  description:
    "Learnspire is a premium learning platform that lets you master your exams with secure video streaming, mentor support, and tracked progress.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socialData = await cmsService.getSocial<Record<string, string>>().catch(() => null);
  const whatsappNumber = socialData?.content?.whatsapp || "";

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable}  antialiased`}
      >
        <AOSProvider>
          <SocialProvider whatsappNumber={whatsappNumber}>
            <AuthProvider>{children}</AuthProvider>
          </SocialProvider>
        </AOSProvider>
      </body>
    </html>
  );
}
