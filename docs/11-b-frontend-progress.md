# Frontend Development Progress (Continuation)

## Session 1 - December 5, 2025 (Continued)

This file continues from `11-progress.md` to avoid conflicts with backend development.

---

### Completed (Frontend)

*See `11-progress.md` for completed frontend work from initial session.*

---

### Not Started (Frontend)

#### Video Player with Watermark
- [ ] Install `@mux/mux-player-react` 
- [ ] Create VideoPlayer component with Mux integration
- [ ] Implement floating watermark overlay:
  - User phone number
  - Current date/time
  - Semi-transparent, moving position
- [ ] Handle view limit enforcement (UI messaging when limit reached)
- [ ] Create course/lesson viewing page for students

#### Admin CMS Management UI
- [ ] CMS sections list page (`/admin/cms`)
- [ ] CMS section editor with JSON content
- [ ] Testimonials management page (`/admin/testimonials`)
- [ ] Instructors management page (`/admin/instructors`)

---

### Frontend Pages Needed

| Route | Page | Status |
|-------|------|--------|
| /courses/[slug] | Course detail (public preview) | ❌ Not Started |
| /courses/[slug]/learn | Course learning page (enrolled) | ❌ Not Started |
| /courses/[slug]/lessons/[id] | Lesson video player | ❌ Not Started |
| /admin/cms | CMS management | ❌ Not Started |
| /admin/testimonials | Testimonials management | ❌ Not Started |
| /admin/instructors | Instructors management | ❌ Not Started |

---

### API Endpoints Available for Frontend

All these backend endpoints are ready to consume:

**Public (No Auth)**
- `GET /courses` - List courses with pricing
- `GET /courses/:slug` - Course detail
- `GET /cms/:section` - CMS content
- `GET /testimonials` - Testimonials list
- `GET /instructors` - Instructors list

**Student (Auth Required)**
- `GET /my-courses` - Enrolled courses with progress
- `GET /my-courses/:slug` - Course with lesson progress
- `GET /lessons/:id` - Lesson with signed video URL
- `POST /lessons/:id/view` - Track video view
- `GET /lessons/:id/view-status` - Check remaining views

**Admin (Admin Auth Required)**
- CMS: `GET/POST/PUT/DELETE /admin/cms`
- Testimonials: `GET/POST/PUT/DELETE /admin/testimonials`
- Instructors: `GET/POST/PUT/DELETE /admin/instructors`

---

### Notes for Frontend Developer

1. **Course Pricing** - Courses now have `price`, `currency`, `isFree` fields. Display appropriately (e.g., "Free" badge or "INR 5,000").

2. **Video Watermark** - Must implement floating watermark with user's phone number and date/time. This is a security requirement.

3. **View Limits** - Check `/lessons/:id/view-status` before playing. Show appropriate message if limit exceeded.

4. **Mux Player** - Use `@mux/mux-player-react` with signed playback URL from `/lessons/:id` endpoint.
