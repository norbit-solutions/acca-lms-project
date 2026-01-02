/**
 * Common Helper Functions
 * Reusable utility functions for the entire application
 */

/**
 * Format a date string into a human-readable relative time format
 * @param dateString - ISO date string to format
 * @returns Formatted relative time string (e.g., "Just now", "5m ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Alias for formatRelativeTime (backward compatibility)
 */
export const formatDate = formatRelativeTime;

/**
 * Format a date to a specific format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateString(
    dateString: string,
    options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
}

/**
 * Calculate dashboard statistics from courses data
 * @param courses - Array of enrolled courses
 * @returns Object containing totalLessons, completedLessons, and avgProgress
 */
export function calculateDashboardStats(
    courses: { lessonsCount: number; completedLessons: number; progress: number }[]
) {
    const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);
    const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
    const avgProgress =
        courses.length > 0
            ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
            : 0;

    return { totalLessons, completedLessons, avgProgress };
}

/**
 * Truncate text to a specific length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

/**
 * Format a number with commas (e.g., 1000 -> "1,000")
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return num.toLocaleString("en-US");
}

/**
 * Format currency
 * @param amount - Amount in cents or whole units
 * @param currency - Currency code (default: USD)
 * @param inCents - Whether the amount is in cents
 * @returns Formatted currency string
 */
export function formatCurrency(
    amount: number,
    currency: string = "USD",
    inCents: boolean = false
): string {
    const value = inCents ? amount / 100 : amount;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(value);
}

/**
 * Generate initials from a name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Check if a string is a valid email
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce a function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert slug to title case
 * @param slug - Slug string (e.g., "my-course-title")
 * @returns Title case string (e.g., "My Course Title")
 */
export function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .map((word) => capitalize(word))
        .join(" ");
}

/**
 * Create a className string from conditional classes
 * @param classes - Object with class names as keys and booleans as values
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * Extract token from a signed URL
 * @param signedUrl - Signed URL containing a token parameter
 * @returns Token string or null if not found
 */
export function extractTokenFromUrl(signedUrl: string | null): string | null {
    if (!signedUrl) return null;
    try {
        const url = new URL(signedUrl);
        return url.searchParams.get("token");
    } catch {
        return null;
    }
}

/**
 * Format duration in seconds to MM:SS format
 * @param seconds - Duration in seconds (can be null)
 * @returns Formatted duration string (or "--:--" if null)
 */
export function formatDuration(seconds: number | null | undefined): string {
    if (seconds == null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
