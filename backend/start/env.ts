/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  /*
  |----------------------------------------------------------
  | CORS configuration
  |----------------------------------------------------------
  */
  CORS_ORIGIN: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Mux (video) configuration
  |----------------------------------------------------------
  */
  MUX_TOKEN_ID: Env.schema.string.optional(),
  MUX_TOKEN_SECRET: Env.schema.string.optional(),
  MUX_SIGNING_KEY_ID: Env.schema.string.optional(),
  MUX_SIGNING_PRIVATE_KEY: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | S3-compatible storage (Cloudflare R2, DO Spaces, AWS S3, etc.)
  |----------------------------------------------------------
  */
  S3_ACCESS_KEY: Env.schema.string.optional(),
  S3_SECRET_KEY: Env.schema.string.optional(),
  S3_ENDPOINT: Env.schema.string.optional(),
  S3_BUCKET: Env.schema.string.optional(),
})
