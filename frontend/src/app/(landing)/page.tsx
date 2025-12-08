import {
  HeroSection,
  UpcomingCoursesSection,
  AllCoursesSection,
  MentorSection,
  WhyChooseSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from "@/components/landing";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UpcomingCoursesSection />
      <AllCoursesSection />
      <MentorSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
