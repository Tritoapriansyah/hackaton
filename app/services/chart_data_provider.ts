import Product from '#models/produk'
import User from '#models/user'
import Transaksi from '#models/transaksi'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface ChartDataPoint {
    label: string
    value: number
}

export interface TimeSeriesData {
    date: string
    value: number
}

export interface DashboardStats {
    totalProducts: number
    totalUsers: number
    lowStockProducts: number
    totalProductValue: number
    totalTransactions: number
    totalRevenue: number
    successfulTransactions: number
    failedTransactions: number
}

export class ChartDataProvider {
    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const [productStats, userStats, transactionStats] = await Promise.all([
            this.getProductStats(),
            this.getUserStats(),
            this.getTransactionStats(),
        ])

        return {
            ...productStats,
            ...userStats,
            ...transactionStats,
        }
    }

    private async getProductStats() {
        const totalProducts = await Product.query().count('* as total')
        const lowStockProducts = await Product.query().where('stock', '<', 10).count('* as total')
        const productValue = await Product.query().sum('price * stock as total').first()

        return {
            totalProducts: Number(totalProducts[0].$extras.total),
            lowStockProducts: Number(lowStockProducts[0].$extras.total),
            totalProductValue: Number(productValue?.$extras.total || 0),
        }
    }

    private async getUserStats() {
        const totalUsers = await User.query().count('* as total')
        return {
            totalUsers: Number(totalUsers[0].$extras.total),
        }
    }

    private async getTransactionStats() {
        const totalTransactions = await Transaksi.query().count('* as total')
        const successfulTransactions = await Transaksi.query()
            .where('status', 'success')
            .count('* as total')
        const failedTransactions = await Transaksi.query().where('status', 'failed').count('* as total')
        const totalRevenue = await Transaksi.query()
            .where('status', 'success')
            .sum('total as revenue')
            .first()

        return {
            totalTransactions: Number(totalTransactions[0].$extras.total),
            successfulTransactions: Number(successfulTransactions[0].$extras.total),
            failedTransactions: Number(failedTransactions[0].$extras.total),
            totalRevenue: Number(totalRevenue?.$extras.revenue || 0),
        }
    }

    /**
     * Get product stock distribution
     */
    async getStockDistribution(): Promise<ChartDataPoint[]> {
        const distribution = await db.rawQuery(`
      SELECT 
        CASE 
          WHEN stock = 0 THEN 'Out of Stock'
          WHEN stock < 10 THEN 'Low Stock'
          WHEN stock < 50 THEN 'Medium Stock'
          ELSE 'High Stock'
        END as label,
        COUNT(*) as value
      FROM produks
      GROUP BY label
      ORDER BY value DESC
    `)

        return distribution.rows.map((row: any) => ({
            label: row.label,
            value: Number(row.value),
        }))
    }

    /**
     * Get revenue over time
     */
    async getRevenueTimeSeries(days: number = 30): Promise<TimeSeriesData[]> {
        const startDate = DateTime.now().minus({ days }).toSQLDate()

        const data = await db.rawQuery(
            `
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total), 0) as value
      FROM transaksis
      WHERE created_at >= ? AND status = 'success'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
            [startDate]
        )

        return data.rows.map((row: any) => ({
            date: row.date,
            value: Number(row.value),
        }))
    }

    /**
     * Get transaction count over time
     */
    async getTransactionTimeSeries(days: number = 30): Promise<TimeSeriesData[]> {
        const startDate = DateTime.now().minus({ days }).toSQLDate()

        const data = await db.rawQuery(
            `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as value
      FROM transaksis
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
            [startDate]
        )

        return data.rows.map((row: any) => ({
            date: row.date,
            value: Number(row.value),
        }))
    }

    /**
     * Get transaction status distribution
     */
    async getTransactionStatusDistribution(): Promise<ChartDataPoint[]> {
        const distribution = await Transaksi.query()
            .select('status')
            .count('* as value')
            .groupBy('status')

        return distribution.map((row) => ({
            label: row.status,
            value: Number(row.$extras.value),
        }))
    }

    /**
     * Get payment method usage
     */
    async getPaymentMethodUsage(): Promise<ChartDataPoint[]> {
        const distribution = await Transaksi.query()
            .select('payment_method')
            .count('* as value')
            .where('status', 'success')
            .whereNotNull('payment_method')
            .groupBy('payment_method')

        return distribution.map((row) => ({
            label: row.paymentMethod || 'Unknown',
            value: Number(row.$extras.value),
        }))
    }

    /**
     * Get top selling products
     */
    async getTopSellingProducts(limit: number = 10): Promise<ChartDataPoint[]> {
        const products = await db.rawQuery(
            `
      SELECT 
        product as label,
        SUM(quantity) as value
      FROM transaksis
      WHERE status = 'success'
      GROUP BY product
      ORDER BY value DESC
      LIMIT ?
    `,
            [limit]
        )

        return products.rows.map((row: any) => ({
            label: row.label,
            value: Number(row.value),
        }))
    }

    /**
     * Get revenue by product
     */
    async getRevenueByProduct(limit: number = 10): Promise<ChartDataPoint[]> {
        const products = await db.rawQuery(
            `
      SELECT 
        product as label,
        SUM(total) as value
      FROM transaksis
      WHERE status = 'success'
      GROUP BY product
      ORDER BY value DESC
      LIMIT ?
    `,
            [limit]
        )

        return products.rows.map((row: any) => ({
            label: row.label,
            value: Number(row.value),
        }))
    }

    /**
     * Get top products by inventory value
     */
    async getTopProductsByValue(limit: number = 10): Promise<ChartDataPoint[]> {
        const products = await Product.query()
            .select('name')
            .select(db.raw('(price * stock) as total_value'))
            .orderBy('total_value', 'desc')
            .limit(limit)

        return products.map((product) => ({
            label: product.name,
            value: Number(product.$extras.total_value),
        }))
    }

    /**
     * Get user role distribution
     */
    async getUserRoleDistribution(): Promise<ChartDataPoint[]> {
        const distribution = await User.query().select('role').count('* as value').groupBy('role')

        return distribution.map((row) => ({
            label: row.role,
            value: Number(row.$extras.value),
        }))
    }

    /**
     * Get low stock alerts
     */
    async getLowStockAlerts(threshold: number = 10) {
        const products = await Product.query()
            .where('stock', '<', threshold)
            .orderBy('stock', 'asc')
            .limit(20)

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
            price: product.price,
        }))
    }

    /**
     * Get comprehensive dashboard overview
     */
    async getDashboardOverview() {
        const [stats, recentRevenue, topProducts, paymentMethods, statusDist] = await Promise.all([
            this.getDashboardStats(),
            this.getRevenueTimeSeries(7),
            this.getTopSellingProducts(5),
            this.getPaymentMethodUsage(),
            this.getTransactionStatusDistribution(),
        ])

        return {
            stats,
            charts: {
                recentRevenue,
                topProducts,
                paymentMethods,
                statusDistribution: statusDist,
            },
        }
    }
}
