/*
|--------------------------------------------------------------------------
| Cache Service
|--------------------------------------------------------------------------
|
| Service untuk caching menggunakan in-memory cache
| - Cache dashboard data
| - Cache statistics
| - Cache predictions
| Note: Redis dapat diintegrasikan nanti untuk production
|
*/

import { inject } from '@adonisjs/core'

interface CacheStore {
  [key: string]: { value: any; expires: number }
}

@inject()
export class CacheService {
  private store: CacheStore = {}

  constructor() {
    // Initialize with in-memory cache
    // In production, this would use Redis
    this.store = {}
  }

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.store[key]
      if (!item) return null

      // Check if expired
      if (Date.now() > item.expires) {
        delete this.store[key]
        return null
      }

      return item.value as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Set cached data
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      this.store[key] = {
        value,
        expires: Date.now() + ttl * 1000,
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<void> {
    try {
      delete this.store[key]
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const regex = new RegExp(pattern.replace('*', '.*'))
      Object.keys(this.store).forEach((key) => {
        if (regex.test(key)) {
          delete this.store[key]
        }
      })
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const item = this.store[key]
      if (!item) return false

      // Check if expired
      if (Date.now() > item.expires) {
        delete this.store[key]
        return false
      }

      return true
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  /**
   * Get or set cached data (cache-aside pattern)
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    await this.set(key, data, ttl)
    return data
  }

  /**
   * Cache keys
   */
  static keys = {
    dashboard: (userId?: number) => `dashboard:${userId || 'all'}`,
    stats: (type: string) => `stats:${type}`,
    predictions: (productId?: number) => `predictions:${productId || 'all'}`,
    recommendations: (userId?: number) => `recommendations:${userId || 'all'}`,
    trends: (period: string) => `trends:${period}`,
    products: (filters?: string) => `products:${filters || 'all'}`,
    transactions: (filters?: string) => `transactions:${filters || 'all'}`,
  }
}
