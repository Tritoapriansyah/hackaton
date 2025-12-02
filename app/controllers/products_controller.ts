import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProductService } from '#services/product_service'
import { productValidator } from '#validators/product'

@inject()
export default class ProductsController {
    constructor(protected productService: ProductService) { }


    /**
     * Get all products with pagination and search
     */
    async index({ response, request }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const search = request.input('search') || request.input('q')

        const products = await this.productService.getAllProducts(page, limit, search)
        return response.ok(products)
    }

    /**
     * Update product stock
     */
    async updateStock({ params, request, response }: HttpContext) {
        const stock = request.input('stock')

        if (stock === undefined || stock === null) {
            return response.badRequest({ message: 'Stock value is required' })
        }

        const product = await this.productService.updateStock(params.id, Number(stock))
        return response.ok(product)
    }

    /**
     * Import products from CSV
     */
    async import({ request, response }: HttpContext) {
        const file = request.file('file', {
            extnames: ['csv', 'txt'],
            size: '2mb',
        })

        if (!file) {
            return response.badRequest({ message: 'File is required' })
        }

        if (!file.isValid) {
            return response.badRequest({ message: 'Invalid file', errors: file.errors })
        }

        try {
            const count = await this.productService.importProducts(file)
            return response.created({ message: `Successfully imported ${count} products` })
        } catch (error: any) {
            return response.unprocessableEntity({
                message: 'Failed to import products',
                error: error.message
            })
        }
    }

    /**
     * Export products to CSV
     */
    async export({ response }: HttpContext) {
        const csvContent = await this.productService.exportProducts()

        response.header('Content-Type', 'text/csv')
        response.header('Content-Disposition', 'attachment; filename="products.csv"')

        return response.send(csvContent)
    }

    /**
     * Get product by ID
     */
    async show({ params, response }: HttpContext) {
        const product = await this.productService.getProductById(params.id)
        return response.ok(product)
    }

    /**
     * Create new product
     */
    async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(productValidator)
        const product = await this.productService.createProduct(payload)
        return response.created(product)
    }

    /**
     * Update product
     */
    async update({ params, request, response }: HttpContext) {
        const payload = await request.validateUsing(productValidator)
        const product = await this.productService.updateProduct(params.id, payload)
        return response.ok(product)
    }

    /**
     * Delete product
     */
    async destroy({ params, response }: HttpContext) {
        await this.productService.deleteProduct(params.id)
        return response.noContent()
    }
}