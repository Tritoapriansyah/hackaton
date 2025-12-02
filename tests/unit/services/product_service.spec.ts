import { test } from '@japa/runner'
import { ProductService } from '#services/product_service'
import Product from '#models/produk'
import User from '#models/user'
import { LogService } from '#services/log_service'

test.group('Product Service | Unit', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
    await User.query().delete()
  })

  test('should create a product', async ({ assert }) => {
    const productService = new ProductService(new LogService())

    const product = await productService.createProduct({
      name: 'Test Product',
      price: 10000,
      stock: 10,
      description: 'Test description',
    })

    assert.exists(product.id)
    assert.equal(product.name, 'Test Product')
    assert.equal(product.price, 10000)
    assert.equal(product.stock, 10)
  })

  test('should update product stock', async ({ assert }) => {
    const productService = new ProductService(new LogService())
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    const product = await Product.create({
      name: 'Test Product',
      price: 10000,
      stock: 10,
      description: 'Test',
    })

    const updated = await productService.updateStock(product.id, 20, user.id)

    assert.equal(updated.stock, 20)
  })

  test('should get all products with pagination', async ({ assert }) => {
    const productService = new ProductService(new LogService())

    // Create multiple products
    await Product.createMany([
      { name: 'Product 1', price: 1000, stock: 10, description: 'Test' },
      { name: 'Product 2', price: 2000, stock: 20, description: 'Test' },
      { name: 'Product 3', price: 3000, stock: 30, description: 'Test' },
    ])

    const result = await productService.getAllProducts(1, 2)

    const data = result.all()
    const meta = result.serialize().meta

    assert.exists(data)
    assert.exists(meta)
    assert.equal(data.length, 2)
    assert.equal(meta.total, 3)
  })
})
