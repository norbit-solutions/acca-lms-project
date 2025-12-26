# Learn Spear - Project Overview

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: AdonisJS 6 (API mode)
- **Database**: MySQL
- **Video**: Mux (signed URLs, in-app upload)
- **Storage**: Digital Ocean Spaces (images, PDFs)
- **Deployment**: Digital Ocean App Platform

## Core Features
1. Public marketing pages (CMS-controlled)
2. Course structure: Courses → Chapters → Lessons (video/text/PDF)
3. Student self-registration + admin-managed enrollment
4. Single active session per user
5. Video view limits (configurable per lesson)
6. Watermarked video playback with anti-recording measures
7. Admin panel for all content management

## User Roles
- **Student**: Self-registers, requests enrollment, watches content
- **Admin**: Manages CMS, courses, enrollments, users

## Security Measures
- Mux signed URLs (server-generated, time-limited)
- Floating watermark (phone + datetime)
- Tab blur detection (pause/blur on focus loss)
- Right-click disabled on video
- Single session enforcement (new login kills old session)
