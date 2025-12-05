# Page Routes

## Public Pages (No Auth)
| Route | Page | Description |
|-------|------|-------------|
| / | Landing | Hero, features, courses, testimonials, instructors |
| /courses | Course List | All published courses |
| /courses/[slug] | Course Preview | Public course info, chapter list (no content) |
| /login | Login | Student/Admin login |
| /register | Register | Student self-registration |

## Student Pages (Auth Required)
| Route | Page | Description |
|-------|------|-------------|
| /dashboard | Dashboard | My enrolled courses overview |
| /my-courses | My Courses | List of enrolled courses |
| /my-courses/[slug] | Course Detail | Full course with chapters, lessons |
| /my-courses/[slug]/lessons/[id] | Lesson | Video player / Text content / PDF viewer |

## Admin Pages (Admin Role Required)
| Route | Page | Description |
|-------|------|-------------|
| /admin | Dashboard | Overview stats |
| /admin/courses | Courses | List, create, edit, delete courses |
| /admin/courses/[id] | Course Editor | Edit course, manage chapters & lessons |
| /admin/courses/[id]/lessons/new | New Lesson | Create lesson form |
| /admin/courses/[id]/lessons/[lid] | Edit Lesson | Edit lesson form |
| /admin/users | Users | List all students |
| /admin/users/[id] | User Detail | Enrollments, view history |
| /admin/enrollments | Enrollments | Manage enrollments |
| /admin/enrollments/new | New Enrollment | Enroll user to course |
| /admin/cms | CMS | List of editable sections |
| /admin/cms/[section] | CMS Editor | Edit specific section |
| /admin/testimonials | Testimonials | CRUD testimonials |
| /admin/instructors | Instructors | CRUD instructors |

## Route Protection
- Public: No middleware
- Student: Check auth, redirect to /login if not
- Admin: Check auth + role=admin, redirect to /login or /dashboard
