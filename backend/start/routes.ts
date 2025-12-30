/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { lookup } from 'mime-types'
import { createReadStream, existsSync } from 'node:fs'
import { join } from 'node:path'
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
const SseController = () => import('#controllers/sse_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/health', async ({ response }) => {
  const health: {
    status: 'healthy' | 'degraded' | 'unhealthy'
    database: 'connected' | 'disconnected'
    storage: 'connected' | 'disconnected' | 'local' | 'not_configured'
    timestamp: string
    errors?: string[]
  } = {
    status: 'healthy',
    database: 'disconnected',
    storage: 'not_configured',
    timestamp: new Date().toISOString(),
    errors: [],
  }

  // Check database connection
  try {
    const db = await import('@adonisjs/lucid/services/db')
    await db.default.rawQuery('SELECT 1')
    health.database = 'connected'
  } catch (error) {
    health.database = 'disconnected'
    health.errors!.push(`Database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Check storage connection
  try {
    const storageModule = await import('#services/storage_service')
    const storageService = storageModule.default

    if (storageService.isLocalStorage()) {
      health.storage = 'local'
    } else {
      // Try to list bucket to verify connection (HeadBucket operation)
      const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
      const envModule = await import('#start/env')
      const env = envModule.default

      const client = new S3Client({
        endpoint: `https://${env.get('S3_ENDPOINT')}`,
        region: 'auto',
        credentials: {
          accessKeyId: env.get('S3_ACCESS_KEY')!,
          secretAccessKey: env.get('S3_SECRET_KEY')!,
        },
      })

      await client.send(new HeadBucketCommand({ Bucket: env.get('S3_BUCKET')! }))
      health.storage = 'connected'
    }
  } catch (error) {
    health.storage = 'disconnected'
    health.errors!.push(`Storage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Determine overall status
  if (health.database === 'disconnected') {
    health.status = 'unhealthy'
  } else if (health.storage === 'disconnected') {
    health.status = 'degraded'
  }

  // Clean up empty errors array
  if (health.errors!.length === 0) {
    delete health.errors
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503
  return response.status(statusCode).json(health)
})

/*
|--------------------------------------------------------------------------
| Static File Uploads Route (for local development)
|--------------------------------------------------------------------------
*/
router.get('/uploads/*', async ({ params, response }) => {
  const filePath = join(app.makePath('public'), 'uploads', params['*'].join('/'))

  if (!existsSync(filePath)) {
    return response.notFound({ error: 'File not found' })
  }

  const mimeType = lookup(filePath) || 'application/octet-stream'
  response.header('Content-Type', mimeType)
  response.header('Cache-Control', 'public, max-age=31536000')

  return response.stream(createReadStream(filePath))
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
router.get('/public/lessons/:id/preview', [PublicController, 'lessonPreview'])

/*
|--------------------------------------------------------------------------
| Student Routes (auth required)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/my-courses', [StudentController, 'myCourses'])
    router.get('/my-courses/:slug', [StudentController, 'myCourse'])
    router.get('/recent-lessons', [StudentController, 'recentLessons'])
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
    router.get('/lessons/:id/signed-urls', [AdminLessonsController, 'getSignedUrls'])

    // Enrollments
    router.get('/enrollments', [AdminEnrollmentsController, 'index'])
    router.post('/enrollments', [AdminEnrollmentsController, 'store'])
    router.delete('/enrollments/:id', [AdminEnrollmentsController, 'destroy'])

    // Users
    router.get('/users', [AdminUsersController, 'index'])
    router.get('/users/search', [AdminUsersController, 'search'])
    router.get('/users/:id', [AdminUsersController, 'show'])
    router.get('/users/:id/views', [AdminUsersController, 'views'])
    router.post('/users/:userId/lessons/:lessonId/view-limit', [
      AdminUsersController,
      'setCustomViewLimit',
    ])
    router.delete('/users/:userId/lessons/:lessonId/view-limit', [
      AdminUsersController,
      'removeCustomViewLimit',
    ])

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

// SSE for real-time updates (no auth - read-only, EventSource doesn't support headers)
router.get('/sse/course/:courseId', [SseController, 'courseUpdates'])

// Lesson status endpoint (for quick refresh after upload)
router
  .get('/admin/lessons/:id/status', [SseController, 'lessonStatus'])
  .use([middleware.auth(), middleware.admin()])
