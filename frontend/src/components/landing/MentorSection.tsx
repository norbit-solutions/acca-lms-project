import Image from "next/image";
import type { Instructor } from "@/types";

interface MentorSectionProps {
  instructors: Instructor[];
}

export default function MentorSection({ instructors }: MentorSectionProps) {
  // Use first instructor as primary mentor
  const mentor = instructors[0];

  if (!mentor) return null;

  return (
    <section className="py-32 px-4 bg-off-white" id="mentors">
      <div className="w-full">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-gray-200 bg-white text-sm font-medium mb-6">
            Mentor
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">
            <span className="">Learn with</span>
            <br />
            <span className="font-semibold">{mentor.name}</span>
          </h2>
          {mentor.bio && (
            <p className="text-gray-600 max-w-xl mx-auto">{mentor.bio}</p>
          )}
        </div>

        <div
          className="flex justify-center mb-16"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          <div className="relative w-80 h-96 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
            <div className="relative rounded-3xl overflow-hidden transform -rotate-3 group-hover:rotate-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 w-full h-full">
              {mentor.avatarUrl ? (
                <Image
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                  <span className="text-8xl text-white font-display">
                    {mentor.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {mentor.title && (
          <div
            className="text-center"
            data-aos="fade-up"
          >
            <h3 className="text-2xl font-semibold mb-8 mt-52">
              {mentor.title}
            </h3>
          </div>
        )}

        {/* Show other instructors if available */}
        {instructors.length > 1 && (
          <div
            className="mt-16"
            data-aos="fade-up"
          >
            <h3 className="text-xl font-semibold text-center mb-8">Our Team</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              {instructors.slice(1).map((instructor) => (
                <div key={instructor.id} className="text-center">
                  {instructor.avatarUrl ? (
                    <Image
                      src={instructor.avatarUrl}
                      alt={instructor.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl text-white font-bold">
                        {instructor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="font-medium">{instructor.name}</p>
                  {instructor.title && (
                    <p className="text-sm text-gray-500">{instructor.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
