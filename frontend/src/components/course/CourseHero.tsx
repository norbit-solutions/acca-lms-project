import WhatsAppLink from "@/components/WhatsAppLink";
import Image from "next/image";
import Link from "next/link";

interface CourseHeroProps {
  title: string;
  shortIntroduction: string;
  image: string;
  courseFee?: number;
  feeCurrency?: string;
  courseSlug: string;
}

export default function CourseHero({
  title,
  shortIntroduction,
  image,
  courseFee,
  feeCurrency,
}: CourseHeroProps) {
  return (
    <div className="bg-white text-black py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Content */}
        <div
          className="flex-1 space-y-8"
          data-aos="fade-right"
        >


          <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl font-light">
            {shortIntroduction}
          </p>

          <div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <WhatsAppLink
                message={`I want to enroll in ${title}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full font-medium text-lg  transition-all"
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

              <div className="flex flex-col">
                <span className="text-3xl font-display font-medium">
                  {feeCurrency} {courseFee}
                </span>
                <span className="text-sm text-gray-500">One-time payment</span>
              </div>
            </div>

          </div>


        </div>

        {/* Right Image */}
        <div
          className="flex-1 w-full lg:w-auto"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          <div className="aspect-4/3 relative rounded-xl overflow-hidden hover:rotate-0 transition-transform duration-500">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No Preview Available
              </div>
            )}

            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
