import Link from "next/link";

interface CourseSidebarProps {
  enrolled?: boolean;
  enableManualPayment?: boolean;
  whatsappNumber?: string;
  title: string;
}

export default function CourseSidebar({
  enrolled = false,
  enableManualPayment = false,
  whatsappNumber = "94XXXXXXXXX",
  title,
}: CourseSidebarProps) {
  const features = [
    "Full lifetime access",
    "Access on mobile and TV",
    "Certificate of completion",
  ];

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
        <h3 className="font-bold text-lg mb-4">What&apos;s Included</h3>
        <ul className="space-y-3 text-sm text-gray-600 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {!enrolled && enableManualPayment && (
          <Link
            href={`https://wa.me/${whatsappNumber}?text=I want to enroll in ${encodeURIComponent(
              title
            )}`}
            target="_blank"
            className="block w-full bg-black text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Enroll Now
          </Link>
        )}
      </div>
    </div>
  );
}
