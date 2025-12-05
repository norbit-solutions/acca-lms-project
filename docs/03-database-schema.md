# Database Schema

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK, auto-increment |
| name | varchar(255) | |
| email | varchar(255) | unique |
| phone | varchar(20) | unique, used for watermark |
| password | varchar(255) | hashed |
| role | enum(student, admin) | default: student |
| session_token | varchar(255) | nullable, for single-session |
| created_at | timestamp | |
| updated_at | timestamp | |

### courses
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| title | varchar(255) | |
| slug | varchar(255) | unique |
| description | text | |
| thumbnail | varchar(500) | URL |
| is_published | boolean | default: false |
| created_at | timestamp | |
| updated_at | timestamp | |

### chapters
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| course_id | int | FK → courses |
| title | varchar(255) | |
| sort_order | int | |
| created_at | timestamp | |

### lessons
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| chapter_id | int | FK → chapters |
| title | varchar(255) | |
| type | enum(video, text, pdf) | |
| content | text | nullable, for text lessons |
| pdf_url | varchar(500) | nullable, for PDF lessons |
| mux_asset_id | varchar(255) | nullable, for video |
| mux_playback_id | varchar(255) | nullable, for video |
| mux_upload_status | enum(pending, ready, error) | default: pending |
| view_limit | int | default: 2 |
| duration | int | seconds, nullable |
| sort_order | int | |
| created_at | timestamp | |

### enrollments
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| user_id | int | FK → users |
| course_id | int | FK → courses |
| enrolled_by | int | FK → users (admin) |
| enrolled_at | timestamp | |

### video_views
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| user_id | int | FK → users |
| lesson_id | int | FK → lessons |
| view_count | int | default: 0 |
| last_viewed_at | timestamp | |

### cms_contents
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| section_key | varchar(100) | unique (hero, features, why_us) |
| content | json | flexible structure per section |
| updated_at | timestamp | |

### testimonials
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| name | varchar(255) | |
| image | varchar(500) | URL |
| content | text | |
| course_id | int | nullable, FK → courses |
| sort_order | int | |
| is_active | boolean | |

### instructors
| Column | Type | Notes |
|--------|------|-------|
| id | int | PK |
| name | varchar(255) | |
| image | varchar(500) | URL |
| bio | text | |
| sort_order | int | |
| is_active | boolean | |

## Indexes
- users: email, phone, session_token
- courses: slug, is_published
- lessons: chapter_id, mux_playback_id
- enrollments: user_id + course_id (unique)
- video_views: user_id + lesson_id (unique)
