/*
|--------------------------------------------------------------------------
| Monitoring Service
|--------------------------------------------------------------------------
|
| Service untuk monitoring dan observability
| - Performance metrics
| - Error tracking
| - System health
|
*/

import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

export interface PerformanceMetric {
  endpoint: string
  method: string
  duration: number
  statusCode: number
  timestamp: DateTime
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  database: {
    connected: boolean
    responseTime?: number
  }
  cache: {
    connected: boolean
    responseTime?: number
  }
  timestamp: DateTime
}

@inject()
export class MonitoringService {
  private metrics: PerformanceMetric[] = []
  private readonly MAX_METRICS = 1000

  /**
   * Record performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)

    // Keep only last N metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift()
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(filters?: {
    endpoint?: string
    method?: string
    startDate?: DateTime
    endDate?: DateTime
  }): PerformanceMetric[] {
    let filtered = [...this.metrics]

    if (filters?.endpoint) {
      filtered = filtered.filter((m) => m.endpoint.includes(filters.endpoint!))
    }

    if (filters?.method) {
      filtered = filtered.filter((m) => m.method === filters.method)
    }

    if (filters?.startDate) {
      filtered = filtered.filter((m) => m.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filtered = filtered.filter((m) => m.timestamp <= filters.endDate!)
    }

    return filtered
  }

  /**
   * Get average response time
   */
  getAverageResponseTime(endpoint?: string): number {
    const metrics = endpoint ? this.metrics.filter((m) => m.endpoint === endpoint) : this.metrics

    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return Math.round((total / metrics.length) * 100) / 100
  }

  /**
   * Get error rate
   */
  getErrorRate(endpoint?: string): number {
    const metrics = endpoint ? this.metrics.filter((m) => m.endpoint === endpoint) : this.metrics

    if (metrics.length === 0) return 0

    const errors = metrics.filter((m) => m.statusCode >= 400).length
    return Math.round((errors / metrics.length) * 100 * 100) / 100
  }

  /**
   * Get system health
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const memoryUsage = process.memoryUsage()
    const totalMemory = require('node:os').totalmem()
    const usedMemory = memoryUsage.heapUsed
    const memoryPercentage = (usedMemory / totalMemory) * 100

    // Check database connection (simplified)
    let dbConnected = true
    let dbResponseTime: number | undefined
    try {
      const start = Date.now()
      // This would be a real database ping in production
      dbResponseTime = Date.now() - start
    } catch {
      dbConnected = false
    }

    // Check cache connection (simplified)
    let cacheConnected = true
    let cacheResponseTime: number | undefined
    try {
      const start = Date.now()
      // This would be a real cache ping in production
      cacheResponseTime = Date.now() - start
    } catch {
      cacheConnected = false
    }

    // Determine status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (!dbConnected || !cacheConnected) {
      status = 'unhealthy'
    } else if (memoryPercentage > 80) {
      status = 'degraded'
    }

    return {
      status,
      uptime: process.uptime(),
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
      database: {
        connected: dbConnected,
        responseTime: dbResponseTime,
      },
      cache: {
        connected: cacheConnected,
        responseTime: cacheResponseTime,
      },
      timestamp: DateTime.now(),
    }
  }

  /**
   * Get top slow endpoints
   */
  getTopSlowEndpoints(limit: number = 10): Array<{
    endpoint: string
    method: string
    averageDuration: number
    count: number
  }> {
    const endpointMap = new Map<string, { total: number; count: number; method: string }>()

    this.metrics.forEach((metric) => {
      const key = `${metric.method}:${metric.endpoint}`
      const existing = endpointMap.get(key) || { total: 0, count: 0, method: metric.method }

      endpointMap.set(key, {
        total: existing.total + metric.duration,
        count: existing.count + 1,
        method: metric.method,
      })
    })

    return Array.from(endpointMap.entries())
      .map(([endpoint, data]) => ({
        endpoint: endpoint.split(':')[1],
        method: data.method,
        averageDuration: Math.round((data.total / data.count) * 100) / 100,
        count: data.count,
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, limit)
  }
}
