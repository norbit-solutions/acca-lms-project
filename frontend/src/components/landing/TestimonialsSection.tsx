import Image from "next/image";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-32 px-4" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            What our <span className="font-display">students</span> say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real experiences from real people achieving their learning goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col items-center">
              <p className="text-lg md:text-xl leading-relaxed mb-8">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                  <Image
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  {testimonial.designation && (
                    <p className="text-sm text-gray-500">{testimonial.designation}</p>
                  )}
                  {/* Star rating */}
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
