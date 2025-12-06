/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const PublicController = () => import('#controllers/public_controller')
const StudentController = () => import('#controllers/student_controller')
const AdminDashboardController = () => import('#controllers/Admin/dashboard_controller')
const AdminCoursesController = () => import('#controllers/Admin/courses_controller')
const AdminChaptersController = () => import('#controllers/Admin/chapters_controller')
const AdminLessonsController = () => import('#controllers/Admin/lessons_controller')
const AdminEnrollmentsController = () => import('#controllers/Admin/enrollments_controller')
const AdminUsersController = () => import('#controllers/Admin/users_controller')
const AdminCmsController = () => import('#controllers/Admin/cms_controller')
const AdminTestimonialsController = () => import('#controllers/Admin/testimonials_controller')
const AdminInstructorsController = () => import('#controllers/Admin/instructors_controller')
const AdminUploadsController = () => import('#controllers/Admin/uploads_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    // Protected routes (require authentication)
    router
      .group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me'])
      })
      .use(middleware.auth())
  })
  .prefix('/auth')

/*
|--------------------------------------------------------------------------
| Public Routes (no auth required)
|--------------------------------------------------------------------------
*/
router.get('/courses', [PublicController, 'courses'])
router.get('/courses/:slug', [PublicController, 'course'])
router.get('/cms/:section', [PublicController, 'cms'])
router.get('/testimonials', [PublicController, 'testimonials'])
router.get('/instructors', [PublicController, 'instructors'])

/*
|--------------------------------------------------------------------------
| Student Routes (auth required)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/my-courses', [StudentController, 'myCourses'])
    router.get('/my-courses/:slug', [StudentController, 'myCourse'])
    router.get('/lessons/:id', [StudentController, 'lesson'])
    router.post('/lessons/:id/view', [StudentController, 'startView'])
    router.get('/lessons/:id/view-status', [StudentController, 'viewStatus'])
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Dashboard
    router.get('/stats', [AdminDashboardController, 'stats'])

    // Courses
    router.get('/courses', [AdminCoursesController, 'index'])
    router.post('/courses', [AdminCoursesController, 'store'])
    router.get('/courses/:id', [AdminCoursesController, 'show'])
    router.put('/courses/:id', [AdminCoursesController, 'update'])
    router.delete('/courses/:id', [AdminCoursesController, 'destroy'])

    // Chapters
    router.post('/courses/:courseId/chapters', [AdminChaptersController, 'store'])
    router.put('/courses/:courseId/chapters/reorder', [AdminChaptersController, 'reorder'])
    router.put('/chapters/:id', [AdminChaptersController, 'update'])
    router.delete('/chapters/:id', [AdminChaptersController, 'destroy'])

    // Lessons
    router.post('/chapters/:chapterId/lessons', [AdminLessonsController, 'store'])
    router.put('/chapters/:chapterId/lessons/reorder', [AdminLessonsController, 'reorder'])
    router.put('/lessons/:id', [AdminLessonsController, 'update'])
    router.delete('/lessons/:id', [AdminLessonsController, 'destroy'])
    router.post('/lessons/:id/upload-url', [AdminLessonsController, 'getUploadUrl'])

    // Enrollments
    router.get('/enrollments', [AdminEnrollmentsController, 'index'])
    router.post('/enrollments', [AdminEnrollmentsController, 'store'])
    router.delete('/enrollments/:id', [AdminEnrollmentsController, 'destroy'])

    // Users
    router.get('/users', [AdminUsersController, 'index'])
    router.get('/users/search', [AdminUsersController, 'search'])
    router.get('/users/:id', [AdminUsersController, 'show'])
    router.get('/users/:id/views', [AdminUsersController, 'views'])

    // CMS Content
    router.get('/cms', [AdminCmsController, 'index'])
    router.get('/cms/:key', [AdminCmsController, 'show'])
    router.post('/cms', [AdminCmsController, 'store'])
    router.put('/cms/:key', [AdminCmsController, 'update'])
    router.delete('/cms/:key', [AdminCmsController, 'destroy'])

    // Testimonials
    router.get('/testimonials', [AdminTestimonialsController, 'index'])
    router.get('/testimonials/:id', [AdminTestimonialsController, 'show'])
    router.post('/testimonials', [AdminTestimonialsController, 'store'])
    router.put('/testimonials/:id', [AdminTestimonialsController, 'update'])
    router.delete('/testimonials/:id', [AdminTestimonialsController, 'destroy'])
    router.put('/testimonials/reorder', [AdminTestimonialsController, 'reorder'])

    // Instructors
    router.get('/instructors', [AdminInstructorsController, 'index'])
    router.get('/instructors/:id', [AdminInstructorsController, 'show'])
    router.post('/instructors', [AdminInstructorsController, 'store'])
    router.put('/instructors/:id', [AdminInstructorsController, 'update'])
    router.delete('/instructors/:id', [AdminInstructorsController, 'destroy'])
    router.put('/instructors/reorder', [AdminInstructorsController, 'reorder'])

    // File Uploads (DO Spaces)
    router.post('/upload/image', [AdminUploadsController, 'uploadImage'])
    router.post('/upload/pdf', [AdminUploadsController, 'uploadPdf'])
    router.delete('/upload', [AdminUploadsController, 'deleteFile'])
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])

// Mux webhook (no auth needed, verified by Mux signature)
router.post('/webhooks/mux', [AdminLessonsController, 'muxWebhook'])
