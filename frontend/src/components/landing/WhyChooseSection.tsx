interface Highlight {
  title: string;
  description: string;
}

const heroHighlights: Highlight[] = [
  {
    title: "Secure Video Streaming",
    description:
      "Watch your lessons with enterprise-grade DRM protection. Your learning materials are safe and accessible only to enrolled students.",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics. Track completed lessons, quiz scores, and time spent on each module.",
  },
  {
    title: "Expert Mentorship",
    description:
      "Learn from FCCA-certified professionals with years of industry experience. Get personalized feedback and guidance throughout your journey.",
  },
];

export default function WhyChooseSection() {
  if (heroHighlights.length === 0) return null;

  return (
    <section className="py-32 px-4 bg-black text-white" id="benefits">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-24 text-center">
          Why ACCA LMS?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/20">
          {heroHighlights.map((reason, index) => (
            <div key={index} className="pt-12 group">
              <span className="block text-6xl font-display text-white mb-8 group-hover:text-white transition-colors">
                0{index + 1}
              </span>
              <h3 className="text-2xl mb-4">{reason.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
