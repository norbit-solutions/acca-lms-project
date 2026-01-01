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
    <section className="py-32 px-4 bg-white" id="benefits">
      <div className="max-w-7xl mx-auto">
        {/* Header - matching other sections */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
          <h2 className="text-4xl md:text-5xl max-w-xl leading-tight">
            Why <br /> <span className="font-display">{headline || "Learnspire"}</span>?
          </h2>
          <div className="flex flex-col items-end">
            <p className="text-gray-600 max-w-xs mt-6 md:mt-0 text-right mb-4">
              {subheadline || "Discover what makes us different."}
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              {/* Number/Icon */}
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-lg font-bold mb-6">
                {item.icon || `${index + 1}`}
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

