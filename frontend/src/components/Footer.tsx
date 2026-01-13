import { cmsService } from "@/services/cmsService";
import Image from "next/image";
import Link from "next/link";

interface SocialLink {
  platform: string;
  url: string;
}

export default async function Footer() {
  const socialData = await cmsService.getSocial<Record<string, string>>().catch(() => null);
  const content = socialData?.content || {};

  const socialLinks = Object.entries(content)
    .filter(([platform]) => platform.toLowerCase() !== "whatsapp")
    .map(([platform, url]) => ({
      platform,
      url
    })).filter(link => link.url && link.url.trim() !== "");

  return (
    <footer className="bg-white pt-10 pb-10 border-t border-gray-100 font-display!">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          {/* Brand & Socials */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link href="/" className="text-2xl font-medium tracking-tight">
              <Image
                src="/images/logo.png"
                width={100}
                height={100}
                alt="Learnspire Logo"
                className="w-10 object-cover"
              />
            </Link>

            <div className="hidden md:block w-px h-6 bg-gray-200"></div>

            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
            {/* <p className="text-gray-400">© {new Date().getFullYear()} Learnspire</p> */}


          {/* Legal Links & Copyright */}
          {/* <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-500">
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms of Service
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("facebook"))
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        />
      </svg>
    );
  if (p.includes("twitter") || p.includes("x"))
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (p.includes("instagram"))
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  if (p.includes("linkedin"))
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  if (p.includes("youtube"))
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.07 29.07 0 001 11.75a29.07 29.07 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29.07 29.07 0 00.46-5.33 29.07 29.07 0 00-.46-5.33z"
        />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    );

}
