"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I access the course materials?",
    answer:
      "Once enrolled, you can access all course materials through your personal dashboard. Videos are streamed securely and can be watched on any device.",
  },
  {
    question: "Can I download the videos for offline viewing?",
    answer:
      "To protect the content and maintain high quality standards, videos are available for streaming only. However, you can access them anytime with an internet connection.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers. Contact us for installment payment options on select courses.",
  },
  {
    question: "How long do I have access to the course?",
    answer:
      "You get lifetime access to all purchased courses, including any updates we make to the content in the future.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer a 7-day money-back guarantee if you're not satisfied with the course. Contact our support team for assistance.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-4 bg-white" id="faq">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-off-white rounded-2xl p-1 transition-all duration-300 hover:bg-gray-100"
            >
              <div>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center cursor-pointer w-full p-5 text-left"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span
                    className={`transition-transform duration-300 text-gray-400 ${
                      openIndex === index ? "rotate-180" : ""
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

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="w-full bg-off-white text-black font-medium py-4 rounded-xl hover:bg-gray-100 transition-colors">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}
