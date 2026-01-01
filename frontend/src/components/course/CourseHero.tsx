import Image from "next/image";
import Link from "next/link";

interface CourseHeroProps {
  title: string;
  shortIntroduction: string;
  image: string;
  courseFee?: number;
  feeCurrency?: string;
  enableManualPayment?: boolean;
  whatsappNumber?: string;
  enrolled?: boolean;
  courseSlug: string;
}

export default function CourseHero({
  title,
  shortIntroduction,
  image,
  courseFee,
  feeCurrency = "USD",
  enableManualPayment = false,
  whatsappNumber = "94XXXXXXXXX",
  enrolled = false,
  courseSlug,
}: CourseHeroProps) {
  return (
    <div className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-block bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-wide">
            Course
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            {shortIntroduction}
          </p>


          {enrolled ? (
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Continue Learning
            </Link>
          ) : enableManualPayment ? (
            <div className="flex flex-col gap-4">
              <div className="text-3xl font-bold">
                {feeCurrency} {courseFee}
              </div>
              <Link
                href={`https://wa.me/${whatsappNumber}?text=I want to enroll in ${encodeURIComponent(
                  title
                )}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors w-fit"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Enroll via WhatsApp
              </Link>
              <p className="text-xs text-gray-400">
                Manual payment required. Contact us to get access.
              </p>
            </div>
          ) : (
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Enroll Now
            </button>
          )}
        </div>

        <div className="flex-1 w-full md:w-auto">
          <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
