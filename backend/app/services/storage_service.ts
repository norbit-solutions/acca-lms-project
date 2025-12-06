import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import env from '#start/env'
import { v4 as uuidv4 } from 'uuid'

/**
 * Storage Service for DigitalOcean Spaces (S3-compatible)
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

  private getClient(): S3Client {
    if (!this.client) {
      const key = env.get('DO_SPACES_KEY')
      const secret = env.get('DO_SPACES_SECRET')
      const endpoint = env.get('DO_SPACES_ENDPOINT')
      const bucket = env.get('DO_SPACES_BUCKET')

      if (!key || !secret || !endpoint || !bucket) {
        throw new Error('DigitalOcean Spaces credentials not configured')
      }

      this.endpoint = endpoint
      this.bucket = bucket

      this.client = new S3Client({
        endpoint: `https://${endpoint}`,
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
   * Upload a file to DO Spaces
   */
  async upload(buffer: Buffer, options: UploadOptions): Promise<UploadResult> {
    const client = this.getClient()

    // Generate unique filename if not provided
    const ext = this.getExtension(options.contentType)
    const filename = options.filename || `${uuidv4()}${ext}`
    const key = `${options.folder}/${filename}`

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
      ACL: 'public-read',
    })

    await client.send(command)

    // Construct public URL
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
   * Delete a file from DO Spaces
   */
  async delete(key: string): Promise<void> {
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
}

// Export singleton
export default new StorageService()
