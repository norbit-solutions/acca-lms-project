import Image from "next/image";
import Link from "next/link";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
];

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  trustedByText?: string;
  heroImage?: string;
  floatingCardTitle?: string;
  floatingCardSubtitle?: string;
}

export default function HeroSection({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  trustedByText,
  heroImage,
  floatingCardTitle,
  floatingCardSubtitle,
}: HeroSectionProps) {
  // Defaults for all content
  const displayHeadline = headline || "Launch your Learning Journey with Confidence";
  const displaySubheadline = subheadline || "Learnspire is a premium learning platform that lets you master your exams with secure video streaming, mentor support, and tracked progress.";
  const displayCtaText = ctaText || "View Courses";
  const displayCtaLink = ctaLink || "#all-courses";
  const displayTrustedBy = trustedByText || "Trusted by 2000+ Students";
  const displayHeroImage = heroImage || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80&sat=-100";
  const displayFloatingTitle = floatingCardTitle || "Live Classes";
  const displayFloatingSubtitle = floatingCardSubtitle || "Strategic Business Leader";

  return (
    <section className="pt-40 pb-20 px-4 min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Trusted By */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="flex -space-x-3">
          {defaultAvatars.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Student"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 font-medium">
          {displayTrustedBy}
        </p>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl leading-tight mb-6 max-w-4xl mx-auto">
        {displayHeadline.includes("|") ? (
          <>
            {displayHeadline.split("|")[0]} <br />
            <span className="font-display">{displayHeadline.split("|")[1]}</span>
          </>
        ) : (
          displayHeadline
        )}
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
        {displaySubheadline}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href={displayCtaLink}
          className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
        >
          {displayCtaText}
        </Link>
      </div>

      {/* Hero Image */}
      <div className="mt-20 w-full max-w-5xl mx-auto relative">
        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-2xl relative">
          <Image
            src={displayHeroImage}
            alt="Learnspire Dashboard"
            fill
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />

          {/* Floating UI Elements (Decorative) */}
          <div className="absolute top-10 left-10 bg-black/80 backdrop-blur text-white p-4 rounded-xl text-sm">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span>{displayFloatingTitle}</span>
            </div>
            <p className="font-display text-lg">{displayFloatingSubtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

