"use client";

import Image from "next/image";
import Slider from "react-slick";
import type { Testimonial } from "@/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Custom arrow components with monochrome styling
function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group"
      aria-label="Previous testimonial"
    >
      <svg
        className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group"
      aria-label="Next testimonial"
    >
      <svg
        className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-500 transition-colors mt-8" />
    ),
    dotsClass: "slick-dots !flex justify-center gap-2 !bottom-[-40px]",
  };

  return (
    <section className="py-12 md:py-32 px-4 overflow-hidden" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 md:mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl mb-4">
            What our <span className="font-display">students</span> say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real experiences from real people achieving their learning goals
          </p>
        </div>

        <div className="px-8 md:px-16" data-aos="fade-up" data-aos-delay="100">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 h-full">
                  {/* Quote icon */}
                  <svg
                    className="w-10 h-10 text-slate-200 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  
                  <p className="text-lg leading-relaxed mb-6 text-slate-700 min-h-[100px]">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    {testimonial.avatarUrl ? (
                      <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                      {testimonial.designation && (
                        <p className="text-sm text-slate-500">{testimonial.designation}</p>
                      )}
                      {/* Star rating */}
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
