import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ChartDataProvider } from '#services/chart_data_provider'

@inject()
export default class DashboardController {
    constructor(protected chartDataProvider: ChartDataProvider) { }

    /**
     * Get dashboard overview with all key metrics
     */
    async overview({ response }: HttpContext) {
        const data = await this.chartDataProvider.getDashboardOverview()
        return response.ok(data)
    }

    /**
     * Get dashboard statistics
     */
    async stats({ response }: HttpContext) {
        const stats = await this.chartDataProvider.getDashboardStats()
        return response.ok(stats)
    }

    /**
     * Get stock distribution chart data
     */
    async stockDistribution({ response }: HttpContext) {
        const data = await this.chartDataProvider.getStockDistribution()
        return response.ok(data)
    }

    /**
     * Get revenue time series
     */
    async revenueTimeSeries({ request, response }: HttpContext) {
        const days = request.input('days', 30)
        const data = await this.chartDataProvider.getRevenueTimeSeries(days)
        return response.ok(data)
    }

    /**
     * Get transaction time series
     */
    async transactionTimeSeries({ request, response }: HttpContext) {
        const days = request.input('days', 30)
        const data = await this.chartDataProvider.getTransactionTimeSeries(days)
        return response.ok(data)
    }

    /**
     * Get transaction status distribution
     */
    async transactionStatus({ response }: HttpContext) {
        const data = await this.chartDataProvider.getTransactionStatusDistribution()
        return response.ok(data)
    }

    /**
     * Get payment method usage
     */
    async paymentMethods({ response }: HttpContext) {
        const data = await this.chartDataProvider.getPaymentMethodUsage()
        return response.ok(data)
    }

    /**
     * Get top selling products
     */
    async topSellingProducts({ request, response }: HttpContext) {
        const limit = request.input('limit', 10)
        const data = await this.chartDataProvider.getTopSellingProducts(limit)
        return response.ok(data)
    }

    /**
     * Get revenue by product
     */
    async revenueByProduct({ request, response }: HttpContext) {
        const limit = request.input('limit', 10)
        const data = await this.chartDataProvider.getRevenueByProduct(limit)
        return response.ok(data)
    }

    /**
     * Get top products by inventory value
     */
    async topProducts({ request, response }: HttpContext) {
        const limit = request.input('limit', 10)
        const data = await this.chartDataProvider.getTopProductsByValue(limit)
        return response.ok(data)
    }

    /**
     * Get user role distribution
     */
    async roleDistribution({ response }: HttpContext) {
        const data = await this.chartDataProvider.getUserRoleDistribution()
        return response.ok(data)
    }

    /**
     * Get low stock alerts
     */
    async lowStockAlerts({ request, response }: HttpContext) {
        const threshold = request.input('threshold', 10)
        const data = await this.chartDataProvider.getLowStockAlerts(threshold)
        return response.ok(data)
    }
}
