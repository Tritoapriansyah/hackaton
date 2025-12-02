import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

/**
 * Enhanced CORS configuration with security improvements
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: env.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(',').filter(Boolean),
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: ['content-type', 'authorization', 'x-requested-with', 'x-csrf-token', 'x-xsrf-token'],
  exposeHeaders: [
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
    'retry-after',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
  ],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
