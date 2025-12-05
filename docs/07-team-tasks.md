# Team Task Division (6 Hours)

## Developer 1: Backend Core

### Hour 1-2: Setup & Auth
- Initialize AdonisJS project with MySQL
- Create all database migrations
- Create all models with relationships
- Implement auth: register, login, logout
- Implement single-session middleware

### Hour 3-4: Core APIs
- Course/Chapter/Lesson CRUD controllers
- Enrollment controller (admin enrolls user)
- Video view tracking logic
- Mux service: direct upload URL, signed playback URL

### Hour 5-6: Integration & Polish
- Mux webhook endpoint
- CMS CRUD endpoints
- Testimonials/Instructors CRUD
- Testing all endpoints with Postman/Insomnia

---

## Developer 2: Frontend - Public & Student

### Hour 1-2: Setup & Landing
- Initialize Next.js with Tailwind
- Set up API client and auth context
- Build landing page layout
- Hero section component
- Course list section (public)

### Hour 3-4: Auth & Student Dashboard
- Login/Register pages
- Auth state management
- Student dashboard: My Courses list
- Course detail page with chapter/lesson list

### Hour 5-6: Video Player
- Lesson page with video player
- Mux Player integration
- Watermark overlay component
- Anti-screenshot protections
- View limit error handling

---

## Developer 3: Admin Panel

### Hour 1-2: Setup & Layout
- Admin layout with sidebar navigation
- Admin auth guard (check role)
- Dashboard overview page
- User list page

### Hour 3-4: Course Management
- Course list + create/edit forms
- Chapter management (nested under course)
- Lesson form with type selector
- Video upload integration (progress bar)
- PDF/Image upload to DO Spaces

### Hour 5-6: CMS & Enrollment
- CMS editor for each section (hero, features, etc.)
- Testimonials management
- Instructors management
- Enrollment management (search user, enroll to course)
- File upload service integration

---

## Parallel Work Notes
- Dev 1 should deploy API first (even with basic endpoints) so Dev 2 & 3 can test
- Dev 2 & 3 can use mock data initially
- Mux webhook URL needs to be publicly accessible (use ngrok for local dev)
- Share environment variables early

## End of Sprint Checklist
- [ ] User can register and login
- [ ] Admin can create course with video lessons
- [ ] Admin can enroll user to course
- [ ] Student can watch video with watermark
- [ ] View limit enforced
- [ ] Landing page shows CMS content
- [ ] Single session works (old session killed)
