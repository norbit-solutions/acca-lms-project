import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 px-4 bg-black text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl mb-8">Start Learning Today</h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Join ambitious professionals building their future with Learn Spear.
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
