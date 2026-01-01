import {
  AllCoursesSection,
  CTASection,
  FAQSection,
  HeroSection,
  MentorSection,
  TestimonialsSection,
  UpcomingCoursesSection,
  WhyChooseSection,
} from "@/components/landing";
import Navbar from "@/components/Navbar";
import { cmsService } from "@/services/cmsService";
import { courseService } from "@/services/courseService";
import { instructorService } from "@/services/instructorService";
import { testimonialService } from "@/services/testimonialService";

export const dynamic = "force-dynamic";

interface FAQItem {
  question: string;
  answer: string;
}

interface WhyItem {
  title: string;
  description: string;
  icon?: string;
}

interface WhyContent {
  headline?: string;
  subheadline?: string;
  items?: WhyItem[];
}

interface FAQContent {
  items?: FAQItem[];
}

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [publishedCourses, upcomingCourses, testimonials, instructors, faqData, whyData] =
    await Promise.all([
      courseService.getPublishedCourses().catch(() => []),
      courseService.getUpcomingCourses().catch(() => []),
      testimonialService.getAll().catch(() => []),
      instructorService.getAll().catch(() => []),
      cmsService.getSection<FAQContent>("faq").catch(() => null),
      cmsService.getSection<WhyContent>("why-acca").catch(() => null),
    ]);

  // Extract FAQ items (hide if empty)
  const faqs = faqData?.content?.items || [];

  // Extract Why Learnspire content (hide if empty)
  const whyContent = whyData?.content || { items: [] };
  const whyItems = whyContent.items || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UpcomingCoursesSection courses={upcomingCourses} />
      <AllCoursesSection courses={publishedCourses} />
      <MentorSection instructors={instructors} />
      <WhyChooseSection
        headline={whyContent.headline}
        subheadline={whyContent.subheadline}
        items={whyItems}
      />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </main>
  );
}
