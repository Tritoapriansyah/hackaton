import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Simplified throttle middleware using @adonisjs/limiter core functionality
 */
export default class ThrottleMiddleware {
  private static readonly requests = new Map<string, { count: number; resetTime: number }>()

  // Configuration - General API throttling 100 requests per minute
  private readonly WINDOW_MS = 60 * 1000 // 1 minute
  private readonly MAX_REQUESTS = 100

  private getClientKey(request: HttpContext['request']): string {
    return request.ip() || 'anonymous'
  }

  private isRateLimited(clientKey: string): boolean {
    const now = Date.now()
    const clientData = ThrottleMiddleware.requests.get(clientKey)

    if (!clientData) {
      return false
    }

    if (now > clientData.resetTime) {
      // Reset the counter if time window has passed
      ThrottleMiddleware.requests.delete(clientKey)
      return false
    }

    return clientData.count >= this.MAX_REQUESTS
  }

  private incrementRequestCount(clientKey: string): void {
    const now = Date.now()
    const clientData = ThrottleMiddleware.requests.get(clientKey)

    if (!clientData) {
      // New client
      ThrottleMiddleware.requests.set(clientKey, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      })
      return
    }

    if (now > clientData.resetTime) {
      // Reset window
      ThrottleMiddleware.requests.set(clientKey, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      })
      return
    }

    // Increment existing counter
    clientData.count++
  }

  private getRetryAfterSeconds(clientKey: string): number {
    const clientData = ThrottleMiddleware.requests.get(clientKey)
    if (!clientData) return 0

    const remainingTime = clientData.resetTime - Date.now()
    return Math.ceil(remainingTime / 1000)
  }

  async handle({ request, response }: HttpContext, next: NextFn) {
    const clientKey = this.getClientKey(request)

    // Check if already rate limited
    if (this.isRateLimited(clientKey)) {
      const retryAfter = this.getRetryAfterSeconds(clientKey)

      return response
        .status(429)
        .header('X-RateLimit-Limit', String(this.MAX_REQUESTS))
        .header('X-RateLimit-Remaining', '0')
        .header('X-RateLimit-Reset', String(Date.now() + this.WINDOW_MS))
        .header('Retry-After', String(retryAfter))
        .json({
          message: 'Too many requests, please try again later',
          retryAfter,
          limit: this.MAX_REQUESTS,
          remaining: 0,
        })
    }

    this.incrementRequestCount(clientKey)

    // Add rate limit information to headers
    const clientData = ThrottleMiddleware.requests.get(clientKey)
    if (clientData) {
      response.header('X-RateLimit-Limit', String(this.MAX_REQUESTS))
      response.header(
        'X-RateLimit-Remaining',
        String(Math.max(0, this.MAX_REQUESTS - clientData.count))
      )
      response.header('X-RateLimit-Reset', String(clientData.resetTime))
    } else {
      response.header('X-RateLimit-Limit', String(this.MAX_REQUESTS))
      response.header('X-RateLimit-Remaining', String(this.MAX_REQUESTS))
    }

    return next()
  }
}
