import Image from "next/image";

interface Mentor {
  name: string;
  bio: string;
  photo: string;
}

const mentor: Mentor = {
  name: "Sarah Johnson",
  bio: "FCCA qualified with over 15 years of experience mentoring ACCA students. Passionate about helping students achieve their professional goals through structured learning.",
  photo:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
};

const achievements = [
  "15+ years mentoring Audit & Assurance candidates",
  "Former Senior Manager at PwC and EY",
  "FCCA certified with specialized expertise in Strategic Professional papers",
  "Helped 2000+ students achieve their ACCA qualification",
];

export default function MentorSection() {
  return (
    <section className="py-32 px-4 bg-off-white" id="mentors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full border border-gray-200 bg-white text-sm font-medium mb-6">
            Mentor
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">
            <span className="">Learn with</span>
            <br />
            <span className="font-semibold">{mentor.name}</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">{mentor.bio}</p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="relative w-80 h-96 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
            <div className="relative rounded-3xl overflow-hidden transform -rotate-3 group-hover:rotate-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 w-full h-full">
              <Image
                src={mentor.photo}
                alt={mentor.name}
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-8 mt-52">
            Achievements & Experience
          </h3>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 text-left">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-700">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
