/**
 * Instructor Service
 * Handles all instructor-related API calls
 */

import api from "@/lib/fetchConfig";
import type { Instructor, InstructorsResponse } from "@/types";

const INSTRUCTOR_ENDPOINTS = {
  INSTRUCTORS: "/instructors",
} as const;

export const instructorService = {
  /**
   * Get all instructors
   */
  async getAll(): Promise<Instructor[]> {
    const response = await api.get<InstructorsResponse>(
      INSTRUCTOR_ENDPOINTS.INSTRUCTORS
    );
    return response.instructors;
  },
};

export default instructorService;
