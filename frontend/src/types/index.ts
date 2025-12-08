/**
 * Types Index
 * Re-export all types from a single location
 */

// Auth types
export * from "./auth.types";

// Course types
export * from "./course.types";

// CMS types
export * from "./cms.types";

// Testimonial types
export * from "./testimonial.types";

// Instructor types
export * from "./instructor.types";

// Admin types
export * from "./admin.types";

// Common types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
