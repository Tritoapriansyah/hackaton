import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Request logging middleware for security monitoring
 */
export default class RequestLoggerMiddleware {
  async handle({ request, response, auth }: HttpContext, next: NextFn) {
    const startTime = Date.now()
    const url = request.url()
    const ip = request.ip()
    const userAgent = request.header('user-agent')
    const method = request.method()

    // Log incoming request
    console.log({
      type: 'request.start',
      url,
      method,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    })

    try {
      const result = await next()
      const duration = Date.now() - startTime

      // Log successful response
      console.log({
        type: 'request.complete',
        url,
        method,
        duration,
        statusCode: response.response.statusCode,
        userId: auth.user?.id,
        ip,
        timestamp: new Date().toISOString(),
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      // Log failed request
      console.error({
        type: 'request.error',
        url,
        method,
        duration,
        statusCode: response.response.statusCode || 500,
        error: error?.message,
        ip,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  }
}
