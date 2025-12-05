# Folder Structure

```
acca-lms-project/
│
├── frontend/                     # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/        # Public routes (landing, courses)
│   │   │   ├── (auth)/          # Login, register
│   │   │   ├── (student)/       # Student dashboard, course player
│   │   │   └── (admin)/         # Admin panel
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI (buttons, inputs, cards)
│   │   │   ├── landing/         # Hero, features, testimonials
│   │   │   ├── course/          # Course cards, chapter list, lesson item
│   │   │   ├── player/          # Video player, watermark overlay
│   │   │   └── admin/           # Admin-specific components
│   │   ├── lib/
│   │   │   ├── api.ts           # API client (axios/fetch wrapper)
│   │   │   ├── auth.ts          # Auth helpers, session management
│   │   │   └── utils.ts         # General utilities
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript interfaces
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   └── next.config.js
│
├── backend/                      # AdonisJS Application
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── auth_controller.ts
│   │   │   ├── courses_controller.ts
│   │   │   ├── lessons_controller.ts
│   │   │   ├── enrollments_controller.ts
│   │   │   ├── cms_controller.ts
│   │   │   └── upload_controller.ts
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── course.ts
│   │   │   ├── chapter.ts
│   │   │   ├── lesson.ts
│   │   │   ├── enrollment.ts
│   │   │   ├── video_view.ts
│   │   │   └── cms_content.ts
│   │   ├── middleware/
│   │   │   ├── auth_middleware.ts
│   │   │   ├── admin_middleware.ts
│   │   │   └── session_middleware.ts
│   │   ├── services/
│   │   │   ├── mux_service.ts    # Mux upload, signed URL generation
│   │   │   └── storage_service.ts # DO Spaces upload
│   │   └── validators/           # Request validation schemas
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── config/
│   └── start/
│       └── routes.ts
│
├── docs/                         # Documentation
└── docker-compose.yml            # Local MySQL
```
