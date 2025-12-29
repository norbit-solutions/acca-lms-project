import type { HttpContext } from '@adonisjs/core/http'
import type { ServerResponse } from 'node:http'
import Lesson from '#models/lesson'

// Store active SSE connections by course ID
const courseConnections = new Map<number, Set<ServerResponse>>()

export default class SseController {
    /**
     * SSE endpoint for course lesson updates
     * Clients subscribe to receive real-time updates when video processing completes
     */
    async courseUpdates({ params, response }: HttpContext) {
        const courseId = Number(params.courseId)

        // Set SSE headers
        response.response.setHeader('Content-Type', 'text/event-stream')
        response.response.setHeader('Cache-Control', 'no-cache')
        response.response.setHeader('Connection', 'keep-alive')
        response.response.setHeader('Access-Control-Allow-Origin', '*')

        // Send initial connection message
        response.response.write(`data: ${JSON.stringify({ type: 'connected', courseId })}\n\n`)

        // Add this connection to the map
        if (!courseConnections.has(courseId)) {
            courseConnections.set(courseId, new Set())
        }
        const connections = courseConnections.get(courseId)!
        connections.add(response.response)

        console.log(`[SSE] Client connected to course ${courseId}. Active connections: ${connections.size}`)

        // Handle client disconnect
        response.response.on('close', () => {
            connections.delete(response.response)
            if (connections.size === 0) {
                courseConnections.delete(courseId)
            }
            console.log(`[SSE] Client disconnected from course ${courseId}. Remaining: ${connections.size}`)
        })

        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
            try {
                response.response.write(': heartbeat\n\n')
            } catch {
                clearInterval(heartbeat)
            }
        }, 30000)

        response.response.on('close', () => {
            clearInterval(heartbeat)
        })

        // Don't end the response - keep it open for SSE
    }

    /**
     * Get lesson status - for quick refresh after upload
     */
    async lessonStatus({ params, response }: HttpContext) {
        const lesson = await Lesson.find(params.id)

        if (!lesson) {
            return response.notFound({ message: 'Lesson not found' })
        }

        return response.ok({
            id: lesson.id,
            muxStatus: lesson.muxStatus,
            muxUploadId: lesson.muxUploadId,
            muxAssetId: lesson.muxAssetId,
            playbackId: lesson.muxPlaybackId,
            duration: lesson.duration,
        })
    }
}

/**
 * Broadcast lesson update to all connected SSE clients for a course
 */
export function broadcastLessonUpdate(
    courseId: number,
    lessonId: number,
    data: {
        muxStatus: string
        playbackId: string | null
        thumbnailUrl: string | null
        duration: number | null
    }
) {
    const connections = courseConnections.get(courseId)

    if (!connections || connections.size === 0) {
        console.log(`[SSE] No clients connected to course ${courseId}`)
        return
    }

    const message = JSON.stringify({
        type: 'lesson:updated',
        lessonId,
        data,
    })

    console.log(`[SSE] Broadcasting to ${connections.size} clients for course ${courseId}`)

    for (const conn of connections) {
        try {
            conn.write(`data: ${message}\n\n`)
        } catch (error) {
            console.error('[SSE] Error writing to connection:', error)
            connections.delete(conn)
        }
    }
}
