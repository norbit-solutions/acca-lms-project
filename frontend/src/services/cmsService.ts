/**
 * CMS Service
 * Handles all CMS content-related API calls
 */

import api from "@/lib/fetchConfig";

const CMS_ENDPOINTS = {
  CMS: (section: string) => `/cms/${section}`,
} as const;

export const cmsService = {
  /**
   * Get CMS content for a specific section
   */
  async getSection<T = Record<string, unknown>>(
    section: string
  ): Promise<{ section: string; content: T }> {
    return api.get<{ section: string; content: T }>(
      CMS_ENDPOINTS.CMS(section)
    );
  },

  /**
   * Get hero section content
   */
  async getHero() {
    return this.getSection("hero");
  },

  /**
   * Get about section content
   */
  async getAbout() {
    return this.getSection("about");
  },

  /**
   * Get contact information
   */
  async getContact() {
    return this.getSection("contact");
  },

  /**
   * Get FAQ section content
   */
  async getFaq() {
    return this.getSection("faq");
  },

  /**
   * Get Social Media links
   */
  async getSocial<T = Record<string, unknown>>() {
    return this.getSection<T>("social");
  },
};

export default cmsService;
