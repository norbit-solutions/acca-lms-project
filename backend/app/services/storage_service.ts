import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
  private publicEndpoint: string = ''
  private useLocal: boolean = false
  private localBasePath: string = ''
  private localBaseUrl: string = ''

  constructor() {
    // Check if S3-compatible storage is configured
    const key = env.get('S3_ACCESS_KEY')
    const secret = env.get('S3_SECRET_KEY')
    let endpoint = env.get('S3_ENDPOINT')
    const bucket = env.get('S3_BUCKET')
    const publicEndpoint = env.get('S3_PUBLIC_ENDPOINT')

    if (!key || !secret || !endpoint || !bucket) {
      // Fall back to local storage
      this.useLocal = true
      this.localBasePath = join(app.makePath('public'), 'uploads')
      const host = env.get('HOST', 'localhost')
      const port = env.get('PORT', '3333')
      this.localBaseUrl = `http://${host}:${port}/uploads`
      console.log('📁 Storage: Using local file storage (cloud storage not configured)')
    } else {
      // Strip protocol from endpoint if present
      this.endpoint = endpoint.replace(/^https?:\/\//, '')
      this.bucket = bucket
      this.publicEndpoint = publicEndpoint ? publicEndpoint.replace(/\/$/, '') : ''
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
        region: 'auto',
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
      ACL: 'public-read', // Ensure public access for DO Spaces/S3
    })

    await client.send(command)

    // Generate public URL
    let url: string
    if (this.publicEndpoint) {
      // Use configured public endpoint (e.g., R2 custom domain or public R2.dev URL)
      // Format: https://public.domain.com/key
      const baseUrl = this.publicEndpoint.startsWith('http')
        ? this.publicEndpoint
        : `https://${this.publicEndpoint}`
      url = `${baseUrl}/${key}`
    } else {
      // Default S3 style
      url = `https://${this.bucket}.${this.endpoint}/${key}`
    }

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
   * Upload a document (PDF, Word, Excel, PowerPoint, etc.)
   */
  async uploadPdf(buffer: Buffer, contentType: string = 'application/pdf'): Promise<UploadResult> {
    return this.upload(buffer, { folder: 'pdfs', contentType })
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
      // Word documents
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      // Excel documents
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      // PowerPoint documents
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      // Text documents
      'text/plain': '.txt',
      'application/rtf': '.rtf',
      'text/rtf': '.rtf',
    }
    return map[contentType] || ''
  }

  /**
   * Check if using local storage
   */
  isLocalStorage(): boolean {
    return this.useLocal
  }

  /**
   * Get a presigned URL for accessing a private file
   * @param key The file key (e.g., 'pdfs/uuid.pdf') or full URL
   * @param expiresIn Expiration time in seconds (default 1 hour)
   */
  async getPresignedUrl(keyOrUrl: string, expiresIn: number = 3600): Promise<string> {
    // Extract key from URL if a full URL was provided
    const key = this.extractKeyFromUrl(keyOrUrl)

    if (this.useLocal) {
      // For local storage, just return the local URL
      return `${this.localBaseUrl}/${key}`
    }

    const client = this.getClient()
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    return getSignedUrl(client, command, { expiresIn })
  }

  /**
   * Extract the key from a stored URL
   */
  private extractKeyFromUrl(urlOrKey: string): string {
    // If it's already just a key (no protocol), return as-is
    if (!urlOrKey.includes('://')) {
      return urlOrKey
    }

    try {
      const url = new URL(urlOrKey)
      // Remove leading slash from pathname
      return url.pathname.replace(/^\//, '')
    } catch {
      // If URL parsing fails, assume it's a key
      return urlOrKey
    }
  }

  /**
   * Get the bucket name (for external use)
   */
  getBucket(): string {
    return this.bucket
  }

  /**
   * Get the endpoint (for external use)
   */
  getEndpoint(): string {
    return this.endpoint
  }
}

// Export singleton
export default new StorageService()
