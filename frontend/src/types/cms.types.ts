/**
 * CMS Types
 */

// CMS Section content
export interface CmsSection {
  section: string;
  content: Record<string, unknown>;
}

// CMS Response
export interface CmsResponse {
  section: string;
  content: Record<string, unknown>;
}

// Hero section content
export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  trustedByText: string;
  heroImage?: string;
}

// About section content
export interface AboutContent {
  title: string;
  description: string;
  features: string[];
}

// Contact content
export interface ContactContent {
  whatsappNumber: string;
  email: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}
