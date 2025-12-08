import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/auth";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex font-display! bg-white  ">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black rounded-r-4xl">
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
          alt="Students collaborating"
          fill
          className="object-cover opacity-30 rounded-r-4xl"
          priority
        />
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="max-w-md">
            <h2 className="text-white text-4xl font-display mb-4">
              Start your ACCA journey today
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of students mastering their ACCA exams with expert
              video courses and personalized mentorship.
            </p>
            {/* Features */}
            <div className="space-y-3">
              {[
                "Premium video lessons",
                "Track your progress",
                "24/7 WhatsApp support",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-200">
                  <svg
                    className="w-5 h-5 text-green-400"
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
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="p-6 md:p-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight"
          >
            ACCA LMS
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Already have an account?{" "}
            <span className="text-black underline">Sign in</span>
          </Link>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-xl md:text-3xl font-display mb-2">
                Create account
              </h1>
              <p className="text-black text-md">Start your learning journey</p>
            </div>

            {/* Register Form Component */}
            <RegisterForm />

            {/* WhatsApp Info */}
            <div className="mt-4 text-center w-full">
              <p className="text-sm text-gray-500 mb-3">
                After registration, contact us via WhatsApp for course
                enrollment
              </p>
              <Link
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact via WhatsApp
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
