/**
 * Testimonial Types
 */

// Testimonial item
export interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  sortOrder: number;
}

// Testimonials response
export interface TestimonialsResponse {
  testimonials: Testimonial[];
}
