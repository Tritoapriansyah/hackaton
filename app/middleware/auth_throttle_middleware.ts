import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Authentication-specific throttling middleware
 * Stricter limits for login/register endpoints to prevent brute force attacks
 */
export default class AuthThrottleMiddleware {
  private static readonly requests = new Map<string, { count: number; resetTime: number }>()
  
  // Stricter configuration - 5 attempts per 15 minutes
  private readonly WINDOW_MS = 15 * 60 * 1000 // 15 minutes
  private readonly MAX_REQUESTS = 5

  private getClientKey(request: HttpContext['request']): string {
    const ip = request.ip() || 'anonymous'
    const email = request.input('email') || 'no-email'
    return `auth:${ip}:${email}`
  }

  private isRateLimited(clientKey: string): boolean {
    const clientData = AuthThrottleMiddleware.requests.get(clientKey)

    if (!clientData) {
      return false
    }

    if (Date.now() > clientData.resetTime) {
      // Reset the counter if time window has passed
      AuthThrottleMiddleware.requests.delete(clientKey)
      return false
    }

    return clientData.count >= this.MAX_REQUESTS
  }

  private recordFailedAttempt(clientKey: string): void {
    const now = Date.now()
    const clientData = AuthThrottleMiddleware.requests.get(clientKey)

    if (!clientData || now > clientData.resetTime) {
      AuthThrottleMiddleware.requests.set(clientKey, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      })
      return
    }

    clientData.count++
  }

  private clearAttempts(clientKey: string): void {
    AuthThrottleMiddleware.requests.delete(clientKey)
  }

  private getRetryAfterSeconds(clientKey: string): number {
    const clientData = AuthThrottleMiddleware.requests.get(clientKey)
    if (!clientData) return 0

    return Math.ceil((clientData.resetTime - Date.now()) / 1000)
  }

  async handle({ request, response, auth }: HttpContext, next: NextFn) {
    const clientKey = this.getClientKey(request)

    // Check if already rate limited
    if (this.isRateLimited(clientKey)) {
      const retryAfter = this.getRetryAfterSeconds(clientKey)
      
      return response.status(429).json({
        message: 'Too many failed authentication attempts. Please try again later.',
        retryAfter,
        messageForUser: 'Too many failed login attempts. Please wait before trying again.'
      })
    }

    try {
      const result = await next()
      
      // Clear attempts on successful login
      const isSuccess = response.response.statusCode === 200 && 
                       (request.url().includes('/login') || request.url().includes('/register'))
      
      if (isSuccess) {
        this.clearAttempts(clientKey)
      }
      
      return result
    } catch (error) {
      // Record failed attempts for auth endpoints
      if (request.url().includes('/login') || request.url().includes('/register')) {
        this.recordFailedAttempt(clientKey)
      }
      throw error
    }
  }
}