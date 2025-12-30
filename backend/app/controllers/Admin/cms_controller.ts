import CmsContent from '#models/cms_content'
import type { HttpContext } from '@adonisjs/core/http'

// Request/Response interfaces for strict typing
interface CmsContentData {
  sectionKey: string
  content: Record<string, unknown> | string
  updatedAt: string
}

interface CreateCmsRequest {
  sectionKey: string
  content: Record<string, unknown>
}

interface UpdateCmsRequest {
  content: Record<string, unknown>
}

interface CmsListResponse {
  cms: CmsContentData[]
}

interface CmsItemResponse {
  cms: CmsContentData
}

export default class CmsController {
  /**
   * List all CMS content sections
   */
  async index({ response }: HttpContext): Promise<void> {
    const cmsContents = await CmsContent.query().orderBy('sectionKey', 'asc')

    const result: CmsContentData[] = cmsContents.map((cms) => ({
      sectionKey: cms.sectionKey,
      content: cms.content,
      updatedAt: cms.updatedAt.toISO() ?? '',
    }))

    const responseData: CmsListResponse = { cms: result }
    response.ok(responseData)
  }

  /**
   * Get single CMS section by key
   */
  async show({ params, response }: HttpContext): Promise<void> {
    const cms = await CmsContent.findBy('sectionKey', params.key as string)

    if (!cms) {
      response.notFound({ error: 'CMS section not found' })
      return
    }

    const result: CmsContentData = {
      sectionKey: cms.sectionKey,
      content: cms.content,
      updatedAt: cms.updatedAt.toISO() ?? '',
    }

    const responseData: CmsItemResponse = { cms: result }
    response.ok(responseData)
  }

  /**
   * Create or update CMS section (upsert)
   */
  async store({ request, response }: HttpContext): Promise<void> {
    const body = request.body() as CreateCmsRequest
    const { sectionKey, content } = body

    if (!sectionKey || !content) {
      response.badRequest({ error: 'sectionKey and content are required' })
      return
    }

    // Check if section already exists
    let cms = await CmsContent.findBy('sectionKey', sectionKey)

    if (cms) {
      // Update existing
      cms.content = content
      await cms.save()
    } else {
      // Create new
      cms = await CmsContent.create({
        sectionKey,
        content,
      })
    }

    const result: CmsContentData = {
      sectionKey: cms.sectionKey,
      content: cms.content,
      updatedAt: cms.updatedAt.toISO() ?? '',
    }

    const responseData: CmsItemResponse = { cms: result }
    response.ok(responseData)
  }

  /**
   * Update CMS section content
   */
  async update({ params, request, response }: HttpContext): Promise<void> {
    const cms = await CmsContent.findBy('sectionKey', params.key as string)

    if (!cms) {
      response.notFound({ error: 'CMS section not found' })
      return
    }

    const body = request.body() as UpdateCmsRequest
    const { content } = body

    if (!content) {
      response.badRequest({ error: 'content is required' })
      return
    }

    cms.content = content
    await cms.save()

    const result: CmsContentData = {
      sectionKey: cms.sectionKey,
      content: cms.content,
      updatedAt: cms.updatedAt.toISO() ?? '',
    }

    const responseData: CmsItemResponse = { cms: result }
    response.ok(responseData)
  }

  /**
   * Delete CMS section
   */
  async destroy({ params, response }: HttpContext): Promise<void> {
    const cms = await CmsContent.findBy('sectionKey', params.key as string)

    if (!cms) {
      response.notFound({ error: 'CMS section not found' })
      return
    }

    await cms.delete()
    response.ok({ message: 'CMS section deleted' })
  }
}
