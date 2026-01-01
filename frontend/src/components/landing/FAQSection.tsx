"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-4 bg-white" id="faq">
      <div className="w-full">
        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-gray-200 bg-white text-sm font-medium mb-6">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">
            Most Asked <br /> <span className="font-display">Questions</span>
          </h2>
          <p className="text-gray-500">
            Everything You Need to Know, All in One Place
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 px-4 md:px-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-off-white rounded-2xl p-1 transition-all duration-300 hover:bg-gray-100"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center cursor-pointer w-full p-5 text-left"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span
                    className={`transition-transform duration-300 text-gray-400 ${openIndex === index ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

