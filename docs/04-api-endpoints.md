# API Endpoints

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Student registration |
| POST | /auth/login | Login (invalidates previous session) |
| POST | /auth/logout | Logout current session |
| GET | /auth/me | Get current user |

## Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cms/:section | Get CMS content by section key |
| GET | /testimonials | List active testimonials |
| GET | /instructors | List active instructors |
| GET | /courses | List published courses |
| GET | /courses/:slug | Course detail (public info only) |

## Student (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /my-courses | List enrolled courses |
| GET | /my-courses/:slug | Full course with chapters/lessons |
| GET | /lessons/:id | Get lesson content |
| POST | /lessons/:id/view | Start view (returns signed URL for video) |
| GET | /lessons/:id/view-status | Check remaining views |

## Admin (Requires Admin Role)

### CMS Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /admin/cms/:section | Update CMS section |
| POST | /admin/testimonials | Create testimonial |
| PUT | /admin/testimonials/:id | Update testimonial |
| DELETE | /admin/testimonials/:id | Delete testimonial |
| POST | /admin/instructors | Create instructor |
| PUT | /admin/instructors/:id | Update instructor |
| DELETE | /admin/instructors/:id | Delete instructor |

### Course Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/courses | List all courses |
| POST | /admin/courses | Create course |
| PUT | /admin/courses/:id | Update course |
| DELETE | /admin/courses/:id | Delete course |
| POST | /admin/courses/:id/chapters | Create chapter |
| PUT | /admin/chapters/:id | Update chapter |
| DELETE | /admin/chapters/:id | Delete chapter |
| POST | /admin/chapters/:id/lessons | Create lesson |
| PUT | /admin/lessons/:id | Update lesson |
| DELETE | /admin/lessons/:id | Delete lesson |

### Video Upload (Mux)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /admin/lessons/video/upload-url | Get Mux direct upload URL |
| POST | /admin/lessons/video/webhook | Mux webhook (asset ready) |

### Enrollment Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/enrollments | List all enrollments |
| POST | /admin/enrollments | Enroll user to course |
| DELETE | /admin/enrollments/:id | Remove enrollment |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/users | List all students |
| GET | /admin/users/:id | User detail with enrollments |
| GET | /admin/users/:id/views | User's video view history |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /admin/upload/image | Upload image to DO Spaces |
| POST | /admin/upload/pdf | Upload PDF to DO Spaces |
