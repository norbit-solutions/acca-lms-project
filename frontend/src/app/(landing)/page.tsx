import {
  AllCoursesSection,
  CTASection,
  FAQSection,
  HeroSection,
  MentorSection,
  TestimonialsSection,
  UpcomingCoursesSection,
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


interface FAQContent {
  items?: FAQItem[];
}

interface HeroContent {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  trustedByText?: string;
  heroImage?: string;
  floatingCardTitle?: string;
  floatingCardSubtitle?: string;
}

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [publishedCourses, upcomingCourses, testimonials, instructors, faqData, heroData] =
    await Promise.all([
      courseService.getPublishedCourses().catch(() => []),
      courseService.getUpcomingCourses().catch(() => []),
      testimonialService.getAll().catch(() => []),
      instructorService.getAll().catch(() => []),
      cmsService.getSection<FAQContent>("faq").catch(() => null),
      cmsService.getSection<HeroContent>("hero").catch(() => null),
    ]);

  // Extract FAQ items (hide if empty)
  const faqs = faqData?.content?.items || [];

  // Extract Hero content
  const heroContent = heroData?.content || {};

  // Extract testimonials avatars for Hero section (take up to 4)
  const trustedAvatars = testimonials
    .filter(t => t.avatarUrl)
    .map(t => t.avatarUrl!)
    .slice(0, 4);

  return (
    <main className="min-h-screen font-display!">
      <Navbar />
      <HeroSection
        headline={heroContent.headline}
        subheadline={heroContent.subheadline}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
        trustedByText={heroContent.trustedByText}
        heroImage={heroContent.heroImage}
        floatingCardTitle={heroContent.floatingCardTitle}
        floatingCardSubtitle={heroContent.floatingCardSubtitle}
        trustedAvatars={trustedAvatars}
      />
      <UpcomingCoursesSection courses={upcomingCourses} />
      <AllCoursesSection courses={publishedCourses} />
      <MentorSection instructors={instructors} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </main>
  );
}

