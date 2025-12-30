import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { existsSync } from 'node:fs'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Storage Service
 *
 * Supports two storage backends:
 * 1. S3-compatible storage (production) - Cloudflare R2, AWS S3, DO Spaces, etc.
 * 2. Local file storage (development) - fallback when S3 not configured
 *
 * Used for uploading images and PDFs for:
 * - Course thumbnails
 * - Instructor avatars
 * - Testimonial avatars
 * - Lesson PDF attachments
 */

interface UploadResult {
  key: string
  url: string
  bucket: string
}

interface UploadOptions {
  folder: 'images' | 'pdfs' | 'thumbnails' | 'avatars'
  filename?: string
  contentType: string
}

class StorageService {
  private client: S3Client | null = null
  private bucket: string = ''
  private endpoint: string = ''
  private useLocal: boolean = false
  private localBasePath: string = ''
  private localBaseUrl: string = ''

  constructor() {
    // Check if S3-compatible storage is configured
    const key = env.get('S3_ACCESS_KEY')
    const secret = env.get('S3_SECRET_KEY')
    const endpoint = env.get('S3_ENDPOINT')
    const bucket = env.get('S3_BUCKET')

    if (!key || !secret || !endpoint || !bucket) {
      // Fall back to local storage
      this.useLocal = true
      this.localBasePath = join(app.makePath('public'), 'uploads')
      const host = env.get('HOST', 'localhost')
      const port = env.get('PORT', '3333')
      this.localBaseUrl = `http://${host}:${port}/uploads`
      console.log('📁 Storage: Using local file storage (cloud storage not configured)')
    } else {
      this.endpoint = endpoint
      this.bucket = bucket
      console.log('☁️  Storage: Using cloud storage (R2/S3-compatible)')
    }
  }

  private getClient(): S3Client {
    if (this.useLocal) {
      throw new Error('Cannot get S3 client when using local storage')
    }

    if (!this.client) {
      const key = env.get('S3_ACCESS_KEY')!
      const secret = env.get('S3_SECRET_KEY')!

      this.client = new S3Client({
        endpoint: `https://${this.endpoint}`,
        region: 'us-east-1', // DO Spaces ignores this but SDK requires it
        credentials: {
          accessKeyId: key,
          secretAccessKey: secret,
        },
        forcePathStyle: false,
      })
    }
    return this.client
  }

  /**
   * Ensure the upload directory exists for local storage
   */
  private async ensureLocalDir(folder: string): Promise<string> {
    const dirPath = join(this.localBasePath, folder)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }
    return dirPath
  }

  /**
   * Upload a file (automatically chooses local or S3 based on config)
   */
  async upload(buffer: Buffer, options: UploadOptions): Promise<UploadResult> {
    const ext = this.getExtension(options.contentType)
    const filename = options.filename || `${uuidv4()}${ext}`
    const key = `${options.folder}/${filename}`

    if (this.useLocal) {
      return this.uploadLocal(buffer, options.folder, filename, key)
    }
    return this.uploadS3(buffer, options, key)
  }

  /**
   * Upload to local file system
   */
  private async uploadLocal(
    buffer: Buffer,
    folder: string,
    filename: string,
    key: string
  ): Promise<UploadResult> {
    const dirPath = await this.ensureLocalDir(folder)
    const filePath = join(dirPath, filename)

    await writeFile(filePath, buffer)

    const url = `${this.localBaseUrl}/${key}`

    return {
      key,
      url,
      bucket: 'local',
    }
  }

  /**
   * Upload to DO Spaces (S3)
   */
  private async uploadS3(
    buffer: Buffer,
    options: UploadOptions,
    key: string
  ): Promise<UploadResult> {
    const client = this.getClient()

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
      // Note: R2 doesn't support ACL, use bucket settings for public access
    })

    await client.send(command)

    // For R2 public access, you need to enable it in the bucket settings
    // The public URL format is: https://pub-{hash}.r2.dev/{key}
    // Or use a custom domain. For now, return the S3-style URL
    const url = `https://${this.bucket}.${this.endpoint}/${key}`

    return {
      key,
      url,
      bucket: this.bucket,
    }
  }

  /**
   * Upload an image (validates content type)
   */
  async uploadImage(
    buffer: Buffer,
    contentType: string,
    folder: 'thumbnails' | 'avatars' | 'images' = 'images'
  ): Promise<UploadResult> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(contentType)) {
      throw new Error(`Invalid image type: ${contentType}. Allowed: ${allowedTypes.join(', ')}`)
    }

    return this.upload(buffer, { folder, contentType })
  }

  /**
   * Upload a PDF
   */
  async uploadPdf(buffer: Buffer): Promise<UploadResult> {
    return this.upload(buffer, { folder: 'pdfs', contentType: 'application/pdf' })
  }

  /**
   * Delete a file (from local or S3 based on config)
   */
  async delete(key: string): Promise<void> {
    if (this.useLocal) {
      return this.deleteLocal(key)
    }
    return this.deleteS3(key)
  }

  /**
   * Delete from local file system
   */
  private async deleteLocal(key: string): Promise<void> {
    const filePath = join(this.localBasePath, key)
    try {
      await unlink(filePath)
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  /**
   * Delete from DO Spaces (S3)
   */
  private async deleteS3(key: string): Promise<void> {
    const client = this.getClient()

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    await client.send(command)
  }

  /**
   * Get file extension from content type
   */
  private getExtension(contentType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
    }
    return map[contentType] || ''
  }

  /**
   * Check if using local storage
   */
  isLocalStorage(): boolean {
    return this.useLocal
  }
}

// Export singleton
export default new StorageService()
