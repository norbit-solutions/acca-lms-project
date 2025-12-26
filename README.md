# Learn Spear

A secure video-based Learning Management System with anti-piracy measures.

## Overview

This platform enables students to access course content (video lessons, text, PDFs) with built-in protection against content piracy. Enrollment is managed manually by administrators - no payment gateway integration.

## Key Features

- **Course Management**: Courses → Chapters → Lessons (video/text/PDF)
- **Secure Video Delivery**: Mux integration with signed URLs
- **Anti-Piracy Measures**: Floating watermark, view limits, anti-screenshot protections
- **Single Session**: One active login per user (prevents credential sharing)
- **Manual Enrollment**: Admin enrolls students via dashboard (no self-checkout)
- **CMS-Controlled Landing**: All marketing content editable from admin panel

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | AdonisJS 6 (API mode) |
| Database | MySQL 8 |
| Video | Mux (signed URLs) |
| Storage | Digital Ocean Spaces |
| Deployment | Digital Ocean Droplet |

## Project Structure

```
├── backend/       # AdonisJS API server
├── frontend/      # Next.js application
└── docs/          # Project documentation
```

## Documentation

Detailed documentation is in the `docs/` folder:

| Doc | Description |
|-----|-------------|
| 01-project-overview | Features, security measures, user roles |
| 02-folder-structure | Detailed directory structure |
| 03-database-schema | All tables and relationships |
| 04-api-endpoints | Complete API reference |
| 05-mux-integration | Video upload and playback flow |
| 06-video-security | Security implementation details |
| 07-team-tasks | Task breakdown for development |
| 08-setup-guide | Installation and deployment |
| 09-cms-sections | CMS content structures |
| 10-page-routes | Frontend routing |

## Prerequisites

- Node.js 20+
- MySQL 8+
- Mux account (with signing keys)
- Digital Ocean Spaces bucket

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd acca-lms-project

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

Backend (`backend/.env`):
- Database credentials (MySQL)
- Mux API keys and signing keys
- Digital Ocean Spaces credentials
- App secret key

Frontend (`frontend/.env.local`):
- API URL

See `docs/08-setup-guide.md` for complete environment variable list.

### 3. Setup Database

```bash
cd backend
node ace migration:run
```

### 4. Run Development Servers

Terminal 1 (Backend):
```bash
cd backend
node ace serve --watch
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3333

## User Roles

### Student
- Self-register on the platform
- Request enrollment via WhatsApp/external channel
- Access enrolled courses after admin approval
- Watch videos (with view limit)

### Admin
- Manage all CMS content (landing page sections)
- Create/edit courses, chapters, lessons
- Upload videos (direct to Mux)
- Enroll students to courses
- View user activity and video watch counts

## Security Features

1. **Signed URLs**: Video URLs generated server-side with expiration
2. **View Limits**: Configurable per-lesson (default: 2 views)
3. **Watermark**: Floating overlay with user's phone number + timestamp
4. **Tab Detection**: Video blurs/pauses when tab loses focus
5. **Single Session**: New login invalidates previous session
6. **No Direct URLs**: Video URLs never exposed to client-side code

## Deployment

Recommended: Single Digital Ocean Droplet ($12/mo)
- Ubuntu 22.04
- Nginx reverse proxy
- PM2 process manager
- SSL via Certbot

See `docs/08-setup-guide.md` for deployment instructions.

## License

Proprietary - All rights reserved.
