import WhatsAppLink from "@/components/WhatsAppLink";

interface CourseHeroProps {
  title: string;
  image: string;
  courseFee?: number;
  feeCurrency?: string;
  courseSlug: string;
}

export default function CourseHero({
  title,
  image,
  courseFee,
  feeCurrency,
}: CourseHeroProps) {
  return (
    <div
      className="relative min-h-[80vh] flex items-center pt-32 pb-16 px-4"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content - All on left side */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl" data-aos="fade-right">
          {/* Title */}
          <h1 className="text-4xl line-clamp-4 sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white leading-tight tracking-tight mb-8">
            {title}
          </h1>

          {/* Price & Enroll Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-display font-medium text-white">
                {feeCurrency} {courseFee}
              </span>
              <span className="text-sm text-white/70">One-time payment</span>
              <WhatsAppLink
              message={`I want to enroll in ${title}`}
              className="inline-flex items-center justify-center gap-3 bg-green-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all"
            >
              <span>Enroll Now</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </WhatsAppLink>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
