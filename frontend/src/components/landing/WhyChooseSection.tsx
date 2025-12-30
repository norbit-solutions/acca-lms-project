interface WhyItem {
  title: string;
  description: string;
  icon?: string;
}

interface WhyChooseSectionProps {
  headline?: string;
  subheadline?: string;
  items: WhyItem[];
}

export default function WhyChooseSection({
  headline,
  subheadline,
  items,
}: WhyChooseSectionProps) {
  // Hide section if no items
  if (!items || items.length === 0) return null;

  return (
    <section className="py-32 px-4 bg-black text-white" id="benefits">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl mb-4">
            {headline || "Why Learnspire?"}
          </h2>
          {subheadline && (
            <p className="text-xl text-gray-400">{subheadline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/20">
          {items.map((item, index) => (
            <div key={index} className="pt-12 group">
              <span className="block text-6xl font-display text-white mb-8 group-hover:text-white transition-colors">
                {item.icon || `0${index + 1}`}
              </span>
              <h3 className="text-2xl mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
