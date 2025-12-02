/*
|--------------------------------------------------------------------------
| AI Service
|--------------------------------------------------------------------------
|
| Service untuk AI/ML features:
| - Sales prediction menggunakan linear regression
| - Product recommendations berdasarkan historical data
| - Trend analysis untuk forecasting
|
*/

import { inject } from '@adonisjs/core'
import Transaksi from '#models/transaksi'
import Produk from '#models/produk'
import { DateTime } from 'luxon'
// ML libraries - will be installed
// import Regression from 'ml-regression'
// import { mean, standardDeviation } from 'simple-statistics'

// Simple implementations for now
const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
const standardDeviation = (arr: number[]) => {
  const avg = mean(arr)
  const squareDiffs = arr.map((value) => Math.pow(value - avg, 2))
  return Math.sqrt(mean(squareDiffs))
}

// Simple linear regression implementation
class SimpleLinearRegression {
  private slope: number = 0
  private intercept: number = 0

  constructor(x: number[], y: number[]) {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    this.intercept = (sumY - this.slope * sumX) / n
  }

  predict(x: number): number {
    return this.slope * x + this.intercept
  }
}

@inject()
export class AIService {
  /**
   * Predict sales untuk periode berikutnya menggunakan linear regression
   */
  async predictSales(
    days: number = 30,
    productId?: number
  ): Promise<{
    predictions: Array<{ date: string; predictedRevenue: number; confidence: number }>
    trend: 'increasing' | 'decreasing' | 'stable'
    averageGrowth: number
  }> {
    // Get historical transaction data
    const endDate = DateTime.now()
    const startDate = endDate.minus({ days: 90 }) // 3 bulan data

    let query = Transaksi.query()
      .where('status', 'success')
      .where('created_at', '>=', startDate.toJSDate())

    if (productId) {
      query = query.where('product_id', productId)
    }

    const transactions = await query.orderBy('created_at', 'asc')

    if (transactions.length < 7) {
      // Tidak cukup data untuk prediction
      return {
        predictions: [],
        trend: 'stable',
        averageGrowth: 0,
      }
    }

    // Group by date dan calculate daily revenue
    const dailyRevenue: Record<string, number> = {}
    transactions.forEach((tx) => {
      const date = tx.createdAt.toISODate()!
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0
      }
      dailyRevenue[date] += Number(tx.total || 0)
    })

    // Prepare data for regression
    const dates = Object.keys(dailyRevenue).sort()
    const revenues = dates.map((date) => dailyRevenue[date])
    const x = dates.map((_, index) => index)
    const y = revenues

    // Simple linear regression
    const regression = new SimpleLinearRegression(x, y)

    // Generate predictions
    const predictions: Array<{ date: string; predictedRevenue: number; confidence: number }> = []
    const lastIndex = x.length - 1

    for (let i = 1; i <= days; i++) {
      const futureIndex = lastIndex + i
      const predictedRevenue = Math.max(0, regression.predict(futureIndex))
      const futureDate = DateTime.fromISO(dates[dates.length - 1])
        .plus({ days: i })
        .toISODate()!

      // Calculate confidence based on data variance
      const variance = standardDeviation(revenues)
      const meanRevenue = mean(revenues)
      const confidence = Math.max(0, Math.min(100, 100 - (variance / meanRevenue) * 50))

      predictions.push({
        date: futureDate,
        predictedRevenue: Math.round(predictedRevenue),
        confidence: Math.round(confidence),
      })
    }

    // Determine trend
    const recentRevenues = revenues.slice(-7) // Last 7 days
    const olderRevenues = revenues.slice(-14, -7) // Previous 7 days
    const recentAvg = mean(recentRevenues)
    const olderAvg = mean(olderRevenues)
    const growth = ((recentAvg - olderAvg) / olderAvg) * 100

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    if (growth > 5) {
      trend = 'increasing'
    } else if (growth < -5) {
      trend = 'decreasing'
    }

    return {
      predictions,
      trend,
      averageGrowth: Math.round(growth * 100) / 100,
    }
  }

  /**
   * Recommend products berdasarkan historical sales data
   */
  async recommendProducts(
    _userId?: number,
    limit: number = 5
  ): Promise<
    Array<{
      product: Produk
      score: number
      reason: string
    }>
  > {
    // Get top selling products - using raw query for aggregation
    const topProductsRaw = await Transaksi.query()
      .where('status', 'success')
      .select('product_id')
      .sum('total as total_revenue')
      .count('* as transaction_count')
      .groupBy('product_id')
      .orderBy('total_revenue', 'desc')
      .limit(limit * 2)

    const productIds = topProductsRaw.map((p: any) => p.productId || p.product_id)
    const products = await Produk.query().whereIn('id', productIds)

    // Calculate recommendation scores
    const recommendations = products.map((product) => {
      const productData = topProductsRaw.find(
        (p: any) => (p.productId || p.product_id) === product.id
      )
      const revenue = Number(productData?.$extras?.total_revenue || 0)
      const transactionCount = Number(productData?.$extras?.transaction_count || 0)
      const stockLevel = product.stock
      const price = Number(product.price)

      // Score calculation:
      // - Revenue weight: 40%
      // - Transaction count weight: 30%
      // - Stock availability weight: 20%
      // - Price competitiveness weight: 10%
      const revenueScore = Math.min(100, (revenue / 1000000) * 100) // Normalize to 1M
      const transactionScore = Math.min(100, (transactionCount / 100) * 100) // Normalize to 100 transactions
      const stockScore = stockLevel > 0 ? Math.min(100, (stockLevel / 100) * 100) : 0
      const priceScore = price > 0 ? Math.min(100, (100000 / price) * 100) : 0 // Lower price = higher score

      const totalScore =
        revenueScore * 0.4 + transactionScore * 0.3 + stockScore * 0.2 + priceScore * 0.1

      let reason = 'Popular product'
      if (revenueScore > 70) {
        reason = 'High revenue generator'
      } else if (transactionScore > 70) {
        reason = 'Frequently purchased'
      } else if (stockScore > 70) {
        reason = 'Well stocked'
      }

      return {
        product,
        score: Math.round(totalScore),
        reason,
      }
    })

    // Sort by score and return top N
    return recommendations.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  /**
   * Analyze sales trends
   */
  async analyzeTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<{
    period: string
    totalRevenue: number
    totalTransactions: number
    averageTransactionValue: number
    growthRate: number
    topProducts: Array<{ productId: number; name: string; revenue: number }>
    peakDays: Array<{ day: string; revenue: number }>
  }> {
    const endDate = DateTime.now()
    let startDate: DateTime

    switch (period) {
      case 'week':
        startDate = endDate.minus({ weeks: 1 })
        break
      case 'month':
        startDate = endDate.minus({ months: 1 })
        break
      case 'year':
        startDate = endDate.minus({ years: 1 })
        break
    }

    const transactions = await Transaksi.query()
      .where('status', 'success')
      .where('created_at', '>=', startDate.toSQL()!)
      .preload('productRelation')

    const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0)
    const totalTransactions = transactions.length
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    // Calculate growth rate (compare with previous period)
    const previousStartDate = startDate.minus({
      [period === 'week' ? 'weeks' : period === 'month' ? 'months' : 'years']: 1,
    })
    const previousTransactions = await Transaksi.query()
      .where('status', 'success')
      .where('created_at', '>=', previousStartDate.toSQL()!)
      .where('created_at', '<', startDate.toSQL()!)

    const previousRevenue = previousTransactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0)

    const growthRate =
      previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Top products
    const productRevenue: Record<number, { name: string; revenue: number }> = {}
    transactions.forEach((tx) => {
      if (tx.productId && tx.productRelation) {
        if (!productRevenue[tx.productId]) {
          productRevenue[tx.productId] = {
            name: tx.productRelation.name,
            revenue: 0,
          }
        }
        productRevenue[tx.productId].revenue += Number(tx.total || 0)
      }
    })

    const topProducts = Object.entries(productRevenue)
      .map(([productId, data]) => ({
        productId: Number(productId),
        name: data.name,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Peak days
    const dailyRevenue: Record<string, number> = {}
    transactions.forEach((tx) => {
      const day = tx.createdAt.toISODate()!
      if (!dailyRevenue[day]) {
        dailyRevenue[day] = 0
      }
      dailyRevenue[day] += Number(tx.total || 0)
    })

    const peakDays = Object.entries(dailyRevenue)
      .map(([day, revenue]) => ({ day, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 7)

    return {
      period,
      totalRevenue: Math.round(totalRevenue),
      totalTransactions,
      averageTransactionValue: Math.round(averageTransactionValue),
      growthRate: Math.round(growthRate * 100) / 100,
      topProducts,
      peakDays,
    }
  }
}
