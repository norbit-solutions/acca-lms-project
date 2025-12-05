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
const AdminDashboardController = () => import('#controllers/Admin/dashboard_controller')
const AdminCoursesController = () => import('#controllers/Admin/courses_controller')
const AdminChaptersController = () => import('#controllers/Admin/chapters_controller')
const AdminLessonsController = () => import('#controllers/Admin/lessons_controller')
const AdminEnrollmentsController = () => import('#controllers/Admin/enrollments_controller')
const AdminUsersController = () => import('#controllers/Admin/users_controller')

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
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])

// Mux webhook (no auth needed, verified by Mux signature)
router.post('/webhooks/mux', [AdminLessonsController, 'muxWebhook'])
