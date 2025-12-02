import Product from '#models/produk'
import { productValidator } from '#validators/product'
import { Infer } from '@vinejs/vine/types'
import { LogService } from './log_service.js'
import { inject } from '@adonisjs/core'

@inject()
export class ProductService {
  constructor(private logService: LogService) {}
  /**
   * Create a new product
   */
  async createProduct(payload: Infer<typeof productValidator>) {
    return Product.create(payload)
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: number, payload: Infer<typeof productValidator>, userId?: number) {
    const product = await Product.findOrFail(id)
    const oldStock = product.stock

    product.merge(payload)
    await product.save()

    // Log stock change if stock was updated
    if (payload.stock !== undefined && oldStock !== payload.stock) {
      await this.logService.logStockEdit(id, userId || null, oldStock, payload.stock)
    }

    return product
  }

  /**
   * Delete a product by ID
   */
  async deleteProduct(id: number) {
    const product = await Product.findOrFail(id)
    await product.delete()
  }

  /**
   * Get all products with pagination and search
   */
  async getAllProducts(page: number = 1, limit: number = 10, search?: string) {
    const query = Product.query()

    if (search) {
      query.where((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return query.paginate(page, limit)
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: number) {
    return Product.findOrFail(id)
  }

  /**
   * Update product stock
   */
  async updateStock(id: number, stock: number, userId?: number) {
    const product = await Product.findOrFail(id)
    const oldStock = product.stock

    product.stock = stock
    await product.save()

    // Log the stock change
    await this.logService.logStockEdit(id, userId || null, oldStock, stock)

    return product
  }

  /**
   * Import products from CSV
   */
  async importProducts(file: any) {
    // Simple CSV parsing implementation
    // In a real app, use a proper CSV parser library
    const fs = await import('node:fs')
    const content = await fs.promises.readFile(file.tmpPath, 'utf-8')
    const lines = content.split('\n')
    const headers = lines[0].split(',').map((h) => h.trim())

    const products = []

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(',').map((v) => v.trim())
      const productData: any = {}

      headers.forEach((header, index) => {
        if (values[index]) {
          // Basic type conversion
          if (header === 'price' || header === 'stock') {
            productData[header] = Number(values[index])
          } else {
            productData[header] = values[index]
          }
        }
      })

      if (productData.name && productData.price) {
        products.push(productData)
      }
    }

    if (products.length > 0) {
      await Product.createMany(products)
    }

    return products.length
  }

  /**
   * Export products to CSV
   */
  async exportProducts() {
    const products = await Product.all()
    const headers = ['id', 'name', 'price', 'stock', 'description', 'created_at']
    const rows = [headers.join(',')]

    for (const product of products) {
      const row = [
        product.id,
        `"${product.name.replace(/"/g, '""')}"`, // Escape quotes
        product.price,
        product.stock,
        `"${(product.description || '').replace(/"/g, '""')}"`,
        product.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
      ]
      rows.push(row.join(','))
    }

    return rows.join('\n')
  }

  /**
   * Search products (Deprecated, use getAllProducts with search param)
   */
  async searchProducts(query: string) {
    return this.getAllProducts(1, 10, query)
  }
}
