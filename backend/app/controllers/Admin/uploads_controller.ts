import type { HttpContext } from '@adonisjs/core/http'
import storageService from '#services/storage_service'

// Response interfaces
interface UploadResponse {
  url: string
  key: string
}

interface ErrorResponse {
  error: string
}

export default class UploadsController {
  /**
   * Upload an image to DO Spaces
   * Accepts multipart/form-data with 'file' field
   */
  async uploadImage({ request, response }: HttpContext): Promise<void> {
    const file = request.file('image', {
      // size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })


    if (!file) {
      const errorRes: ErrorResponse = { error: 'No file provided' }
      response.badRequest(errorRes)
      return
    }

    if (!file.isValid) {
      const errorRes: ErrorResponse = { error: file.errors[0]?.message || 'Invalid file' }
      response.badRequest(errorRes)
      return
    }

    try {
      // Read file buffer
      const buffer = await this.readFileBuffer(file)
      const contentType = file.headers['content-type'] || 'image/jpeg'

      // Determine folder based on query param
      const folder = request.input('folder', 'images') as 'thumbnails' | 'avatars' | 'images'

      const result = await storageService.uploadImage(buffer, contentType, folder)

      const uploadRes: UploadResponse = {
        url: result.url,
        key: result.key,
      }
      response.ok(uploadRes)
    } catch (error) {
      const errorRes: ErrorResponse = {
        error: error instanceof Error ? error.message : 'Upload failed',
      }
      response.internalServerError(errorRes)
    }
  }

  /**
   * Upload a PDF to DO Spaces
   * Accepts multipart/form-data with 'file' field
   */
  async uploadPdf({ request, response }: HttpContext): Promise<void> {
    const file = request.file('file', {
      size: '20mb',
      extnames: ['pdf'],
    })

    if (!file) {
      const errorRes: ErrorResponse = { error: 'No file provided' }
      response.badRequest(errorRes)
      return
    }

    if (!file.isValid) {
      const errorRes: ErrorResponse = { error: file.errors[0]?.message || 'Invalid file' }
      response.badRequest(errorRes)
      return
    }

    try {
      const buffer = await this.readFileBuffer(file)
      const result = await storageService.uploadPdf(buffer)

      const uploadRes: UploadResponse = {
        url: result.url,
        key: result.key,
      }
      response.ok(uploadRes)
    } catch (error) {
      const errorRes: ErrorResponse = {
        error: error instanceof Error ? error.message : 'Upload failed',
      }
      response.internalServerError(errorRes)
    }
  }

  /**
   * Delete a file from DO Spaces
   */
  async deleteFile({ request, response }: HttpContext): Promise<void> {
    const { key } = request.body() as { key: string }

    if (!key) {
      const errorRes: ErrorResponse = { error: 'File key is required' }
      response.badRequest(errorRes)
      return
    }

    try {
      await storageService.delete(key)
      response.ok({ message: 'File deleted' })
    } catch (error) {
      const errorRes: ErrorResponse = {
        error: error instanceof Error ? error.message : 'Delete failed',
      }
      response.internalServerError(errorRes)
    }
  }

  /**
   * Read file to buffer
   */
  private async readFileBuffer(file: { tmpPath?: string }): Promise<Buffer> {
    if (!file.tmpPath) {
      throw new Error('File not uploaded to temp path')
    }
    const fs = await import('node:fs/promises')
    return fs.readFile(file.tmpPath)
  }
}
