import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 px-4 relative  text-white text-center"
    style={{
      backgroundImage: "url('/images/learn-image.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}
    
    >
      <div className="opacity-60 bg-black absolute inset-0 z-10"></div>
      <div
        className="max-w-4xl mx-auto relative z-20"
        data-aos="zoom-in"
      >
        <h2 className="text-5xl md:text-7xl mb-8">Start Learning Today</h2>
        <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
          Join ambitious professionals building their future with Learnspire.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-black px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition-transform hover:scale-105"
        >
          Create Free Account
        </Link>
      </div>
    </section>
  );
}
