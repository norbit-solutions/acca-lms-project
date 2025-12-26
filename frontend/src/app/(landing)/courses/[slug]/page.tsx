import { Metadata } from "next";
import CourseNavbar from "@/components/CourseNavbar";
import Footer from "@/components/Footer";
import {
  CourseHero,
  CourseCurriculum,
  CourseSidebar,
} from "@/components/course";

// Sample course data (will come from API later)
const coursesData: Record<string, CourseData> = {
  "fa-financial-accounting": {
    id: 1,
    slug: "fa-financial-accounting",
    title: "FA - Financial Accounting",
    shortIntroduction:
      "Master the fundamentals of financial accounting including double entry bookkeeping, financial statements preparation, and core accounting principles essential for your learning journey.",
    description:
      "This comprehensive course covers all aspects of Financial Accounting. You will learn double entry bookkeeping, prepare financial statements, understand accounting concepts and principles, and develop skills needed to pass the FA exam with confidence. Our expert instructors guide you through each topic with clear explanations and practical examples.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    courseFee: 149,
    feeCurrency: "USD",
    enableManualPayment: true,
    whatsappNumber: "94XXXXXXXXX",
    chapters: [
      {
        id: 1,
        title: "Introduction to Accounting",
        lessons: [
          { id: 1, title: "What is Accounting?", duration: 900 },
          { id: 2, title: "The Accounting Equation", duration: 1200 },
          { id: 3, title: "Types of Business Entities", duration: 840 },
        ],
      },
      {
        id: 2,
        title: "Double Entry Bookkeeping",
        lessons: [
          { id: 4, title: "Understanding Debits and Credits", duration: 1500 },
          { id: 5, title: "The General Ledger", duration: 1200 },
          { id: 6, title: "Trial Balance Preparation", duration: 1080 },
          { id: 7, title: "Journal Entries", duration: 1320 },
        ],
      },
      {
        id: 3,
        title: "Financial Statements",
        lessons: [
          { id: 8, title: "Statement of Profit or Loss", duration: 1800 },
          { id: 9, title: "Statement of Financial Position", duration: 1920 },
          { id: 10, title: "Statement of Cash Flows", duration: 2100 },
        ],
      },
    ],
  },
  "ma-management-accounting": {
    id: 2,
    slug: "ma-management-accounting",
    title: "MA - Management Accounting",
    shortIntroduction:
      "Learn essential management accounting techniques including costing methods, budgeting, variance analysis, and performance measurement for business decision making.",
    description:
      "This course provides a thorough understanding of Management Accounting principles. Topics include cost classification, costing methods, budgeting and forecasting, variance analysis, and performance measurement techniques. Perfect preparation for the MA exam.",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80",
    courseFee: 149,
    feeCurrency: "USD",
    enableManualPayment: true,
    whatsappNumber: "94XXXXXXXXX",
    chapters: [
      {
        id: 1,
        title: "Cost Classification",
        lessons: [
          { id: 1, title: "Types of Costs", duration: 1100 },
          { id: 2, title: "Cost Behavior", duration: 1300 },
          { id: 3, title: "Cost-Volume-Profit Analysis", duration: 1500 },
        ],
      },
      {
        id: 2,
        title: "Budgeting",
        lessons: [
          { id: 4, title: "Budget Preparation", duration: 1400 },
          { id: 5, title: "Flexible Budgets", duration: 1200 },
          { id: 6, title: "Variance Analysis", duration: 1800 },
        ],
      },
    ],
  },
  "fr-financial-reporting": {
    id: 3,
    slug: "fr-financial-reporting",
    title: "FR - Financial Reporting",
    shortIntroduction:
      "Advanced financial reporting covering IFRS standards, group accounts, complex transactions, and interpretation of financial statements for professional accountants.",
    description:
      "This skills-level course covers advanced financial reporting topics including International Financial Reporting Standards (IFRS), preparation of group accounts, complex transactions, and financial statement analysis. Essential for students advancing to the professional level.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    courseFee: 199,
    feeCurrency: "USD",
    enableManualPayment: true,
    whatsappNumber: "94XXXXXXXXX",
    chapters: [
      {
        id: 1,
        title: "IFRS Framework",
        lessons: [
          { id: 1, title: "Conceptual Framework", duration: 1600 },
          {
            id: 2,
            title: "IAS 1 - Presentation of Financial Statements",
            duration: 1800,
          },
          { id: 3, title: "IAS 8 - Accounting Policies", duration: 1400 },
        ],
      },
      {
        id: 2,
        title: "Group Accounts",
        lessons: [
          { id: 4, title: "Business Combinations (IFRS 3)", duration: 2100 },
          { id: 5, title: "Consolidated Financial Statements", duration: 2400 },
          { id: 6, title: "Associates and Joint Ventures", duration: 1900 },
        ],
      },
    ],
  },
  "sbl-strategic-business-leader": {
    id: 4,
    slug: "sbl-strategic-business-leader",
    title: "Strategic Business Leader",
    shortIntroduction:
      "Master strategic leadership with comprehensive case studies, governance frameworks, and professional skills needed for senior finance roles.",
    description:
      "This professional-level course prepares you for the SBL exam with in-depth coverage of leadership, corporate governance, strategy formulation, risk management, and professional ethics. Learn through real-world case studies and develop the skills needed for strategic decision making.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    courseFee: 299,
    feeCurrency: "USD",
    enableManualPayment: true,
    whatsappNumber: "94XXXXXXXXX",
    chapters: [
      {
        id: 1,
        title: "Leadership and Governance",
        lessons: [
          { id: 1, title: "Corporate Governance Frameworks", duration: 2400 },
          { id: 2, title: "Board Structures and Roles", duration: 1800 },
          { id: 3, title: "Stakeholder Management", duration: 2100 },
        ],
      },
      {
        id: 2,
        title: "Strategic Management",
        lessons: [
          { id: 4, title: "Strategy Analysis Tools", duration: 2700 },
          {
            id: 5,
            title: "Strategic Choice and Implementation",
            duration: 2400,
          },
          { id: 6, title: "Change Management", duration: 2100 },
        ],
      },
    ],
  },
};

interface Lesson {
  id: number;
  title: string;
  duration: number;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  id: number;
  slug: string;
  title: string;
  shortIntroduction: string;
  description: string;
  image: string;
  courseFee: number;
  feeCurrency: string;
  enableManualPayment: boolean;
  whatsappNumber: string;
  chapters: Chapter[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = coursesData[slug];

  if (!course) {
    return {
      title: "Course Not Found - Learn Spear",
    };
  }

  return {
    title: `${course.title} - Learn Spear`,
    description: course.shortIntroduction,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const course = coursesData[slug];

  if (!course) {
    return (
      <div className="min-h-screen bg-off-white">
        <CourseNavbar />
        <div className="max-w-7xl h-[80svh] flex flex-col justify-center items-center mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600">
            The course you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  // This would come from auth state in a real app
  const enrolled = false;

  return (
    <div className="min-h-screen bg-off-white">
      <CourseNavbar />

      <CourseHero
        title={course.title}
        shortIntroduction={course.shortIntroduction}
        image={course.image}
        courseFee={course.courseFee}
        feeCurrency={course.feeCurrency}
        enableManualPayment={course.enableManualPayment}
        whatsappNumber={course.whatsappNumber}
        enrolled={enrolled}
        courseSlug={course.slug}
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <CourseCurriculum
          chapters={course.chapters}
          description={course.description}
          shortIntroduction={course.shortIntroduction}
        />

        <CourseSidebar
          enrolled={enrolled}
          enableManualPayment={course.enableManualPayment}
          whatsappNumber={course.whatsappNumber}
          title={course.title}
        />
      </div>
    </div>
  );
}
