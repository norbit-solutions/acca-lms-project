import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  result: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Chen",
    quote:
      "The structured approach and quality of video lessons helped me pass SBL on my first attempt. The mentor support was invaluable during my preparation.",
    result: "Passed SBL - First Attempt",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Priya Sharma",
    quote:
      "I was struggling with FR for months until I found ACCA LMS. The clear explanations and practice questions made all the difference. Highly recommended!",
    result: "Passed FR - 72%",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
];

export default function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 px-4" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            What our <span className="font-display">students</span> say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real experiences from real people achieving their ACCA goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col items-center">
              <p className="text-lg md:text-xl leading-relaxed mb-8">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
