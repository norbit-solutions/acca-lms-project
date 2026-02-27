import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */

// Parse CORS_ORIGIN: can be comma-separated list or 'true' for all origins
function getCorsOrigin(): boolean | string | string[] {
  const corsOrigin = env.get('CORS_ORIGIN')

  if (!corsOrigin || corsOrigin === 'true') {
    return true // Allow all origins (development)
  }

  // Support comma-separated origins for production
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((o) => o.trim())
  }

  return corsOrigin
}

const corsConfig = defineConfig({
  enabled: true,
  origin: getCorsOrigin(),
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
