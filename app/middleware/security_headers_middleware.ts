import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Security headers middleware to protect against common web vulnerabilities
 */
export default class SecurityHeadersMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    const result = await next()

    // Prevent clickjacking attacks
    response.header('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.header('X-Content-Type-Options', 'nosniff')

    // Enable XSS protection
    response.header('X-XSS-Protection', '1; mode=block')

    // Strict Transport Security (only in production)
    if (process.env.NODE_ENV === 'production') {
      response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }

    // Permissions Policy
    response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

    // Referrer Policy
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Content Security Policy
    response.header(
      'Content-Security-Policy',
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self'"
    )

    // Remove server header to hide framework information
    response.removeHeader('X-Powered-By')

    return result
  }
}
