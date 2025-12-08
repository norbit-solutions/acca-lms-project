/**
 * Instructor Types
 */

// Instructor item
export interface Instructor {
  id: number;
  name: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  sortOrder: number;
}

// Instructors response
export interface InstructorsResponse {
  instructors: Instructor[];
}
