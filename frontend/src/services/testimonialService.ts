/**
 * Testimonial Service
 * Handles all testimonial-related API calls
 */

import api from "@/lib/fetchConfig";
import type { Testimonial, TestimonialsResponse } from "@/types";

const TESTIMONIAL_ENDPOINTS = {
  TESTIMONIALS: "/testimonials",
} as const;

export const testimonialService = {
  /**
   * Get all testimonials
   */
  async getAll(): Promise<Testimonial[]> {
    const response = await api.get<TestimonialsResponse>(
      TESTIMONIAL_ENDPOINTS.TESTIMONIALS
    );
    return response.testimonials;
  },
};

export default testimonialService;
