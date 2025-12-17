import Mux from '@mux/mux-node'
import jwt from 'jsonwebtoken'
import env from '#start/env'

interface UploadResponse {
  uploadId: string
  uploadUrl: string
}

interface AssetResponse {
  assetId: string
  playbackId: string
  duration: number | null
  status: string
}

interface WebhookPayload {
  type: string
  data: {
    id: string
    playback_ids?: Array<{ id: string; policy: string }>
    duration?: number
    status?: string
    passthrough?: string
  }
}

class MuxService {
  private client: Mux | null = null
  private signingKeyId: string
  private signingKeySecret: string

  constructor() {
    const tokenId = env.get('MUX_TOKEN_ID')
    const tokenSecret = env.get('MUX_TOKEN_SECRET')
    this.signingKeyId = env.get('MUX_SIGNING_KEY_ID') || ''
    this.signingKeySecret = env.get('MUX_SIGNING_PRIVATE_KEY') || ''

    if (tokenId && tokenSecret) {
      this.client = new Mux({
        tokenId,
        tokenSecret,
      })
    }
  }

  /**
   * Check if Mux is configured
   */
  isConfigured(): boolean {
    return this.client !== null
  }

  /**
   * Create a direct upload URL for video upload
   */
  async createUploadUrl(passthrough?: string): Promise<UploadResponse> {
    if (!this.client) {
      throw new Error('Mux is not configured')
    }

    const upload = await this.client.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['signed'],
        passthrough: passthrough || undefined,
      },
    })

    return {
      uploadId: upload.id,
      uploadUrl: upload.url,
    }
  }

  /**
   * Get asset details from Mux
   */
  async getAsset(assetId: string): Promise<AssetResponse | null> {
    if (!this.client) {
      throw new Error('Mux is not configured')
    }

    try {
      const asset = await this.client.video.assets.retrieve(assetId)
      const playbackId = asset.playback_ids?.[0]?.id || ''

      return {
        assetId: asset.id,
        playbackId,
        duration: asset.duration || null,
        status: asset.status,
      }
    } catch {
      return null
    }
  }

  /**
   * Delete an asset from Mux
   */
  async deleteAsset(assetId: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Mux is not configured')
    }

    try {
      await this.client.video.assets.delete(assetId)
      return true
    } catch {
      return false
    }
  }

  /**
   * Generate a signed playback URL for a video
   * Token is valid for 1 hour
   */
  generateSignedUrl(playbackId: string, expiresInSeconds: number = 3600): string | null {
    if (!this.signingKeyId || !this.signingKeySecret) {
      // Return unsigned URL if signing not configured
      return `https://stream.mux.com/${playbackId}.m3u8`
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      sub: playbackId,
      aud: 'v',
      exp: now + expiresInSeconds,
      kid: this.signingKeyId,
    }

    // Decode base64 signing key secret
    const keySecret = Buffer.from(this.signingKeySecret, 'base64')

    const token = jwt.sign(payload, keySecret, {
      algorithm: 'RS256',
      keyid: this.signingKeyId,
    })

    return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`
  }

  /**
   * Generate a signed thumbnail URL
   */
  generateThumbnailUrl(playbackId: string, options?: { time?: number; width?: number }): string {
    const time = options?.time || 0
    const width = options?.width || 640

    if (!this.signingKeyId || !this.signingKeySecret) {
      return `https://image.mux.com/${playbackId}/thumbnail.png?time=${time}&width=${width}`
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      sub: playbackId,
      aud: 't',
      exp: now + 3600,
      kid: this.signingKeyId,
    }

    const keySecret = Buffer.from(this.signingKeySecret, 'base64')
    const token = jwt.sign(payload, keySecret, {
      algorithm: 'RS256',
      keyid: this.signingKeyId,
    })

    return `https://image.mux.com/${playbackId}/thumbnail.png?time=${time}&width=${width}&token=${token}`
  }

  /**
   * Parse and validate Mux webhook payload
   */
  parseWebhook(payload: unknown): WebhookPayload | null {
    if (!payload || typeof payload !== 'object') {
      return null
    }

    const data = payload as Record<string, unknown>

    if (typeof data.type !== 'string' || !data.data || typeof data.data !== 'object') {
      return null
    }

    return {
      type: data.type,
      data: data.data as WebhookPayload['data'],
    }
  }

  /**
   * Handle video.asset.ready webhook
   * Returns asset info if successful
   */
  handleAssetReady(webhookData: WebhookPayload['data']): AssetResponse | null {
    const playbackId = webhookData.playback_ids?.[0]?.id

    if (!playbackId) {
      return null
    }

    return {
      assetId: webhookData.id,
      playbackId,
      duration: webhookData.duration || null,
      status: webhookData.status || 'ready',
    }
  }
}

export default new MuxService()
