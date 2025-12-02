/*
|--------------------------------------------------------------------------
| Cache Middleware
|--------------------------------------------------------------------------
|
| Middleware untuk caching responses
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { CacheService } from '#services/cache_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CacheMiddleware {
  constructor(private cacheService: CacheService) {}

  async handle(ctx: HttpContext, next: NextFn, options?: { ttl?: number; key?: string }) {
    // Only cache GET requests
    if (ctx.request.method() !== 'GET') {
      return next()
    }

    const ttl = options?.ttl || 3600 // Default 1 hour
    const cacheKey = options?.key || `cache:${ctx.request.url()}`

    // Try to get from cache
    const cached = await this.cacheService.get(cacheKey)
    if (cached) {
      return ctx.response.json(cached)
    }

    // Continue to next middleware/controller
    await next()

    // Cache the response if it's successful
    if (ctx.response.response.statusCode === 200) {
      const responseData = ctx.response.getBody()
      if (responseData) {
        await this.cacheService.set(cacheKey, responseData, ttl)
      }
    }
  }
}
