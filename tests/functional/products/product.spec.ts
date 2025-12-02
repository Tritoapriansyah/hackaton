import { test } from '@japa/runner'
import User from '#models/user'
import Product from '#models/produk'


test.group('Product System', (group) => {
    group.each.setup(async () => {
        await Product.query().delete()
        await User.query().delete()
    })

    async function login(client: any, user: User) {
        const response = await client.post('/api/auth/login').json({
            email: user.email,
            password: 'password123',
        })
        const cookies = response.headers()['set-cookie']
        return cookies?.map((c: string) => c.split(';')[0]).join('; ') || ''
    }

    test('should create a new product', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin',
        })

        const cookie = await login(client, user)

        const response = await client.post('/api/products')
            .header('cookie', cookie)
            .json({
                name: 'Test Product',
                price: 10000,
                stock: 10,
                description: 'A test product',
            })

        response.assertStatus(201)
        response.assertBodyContains({
            name: 'Test Product',
            price: 10000,
        })
    })

    test('should get all products with pagination', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user',
        })

        await Product.createMany([
            { name: 'Product 1', price: 1000, stock: 5 },
            { name: 'Product 2', price: 2000, stock: 10 },
            { name: 'Product 3', price: 3000, stock: 15 },
        ])

        const cookie = await login(client, user)

        const response = await client.get('/api/products?page=1&limit=2')
            .header('cookie', cookie)

        response.assertStatus(200)
        response.assertBodyContains({
            meta: {
                total: 3,
                perPage: 2,
                currentPage: 1,
            },
            data: [
                { name: 'Product 1' },
                { name: 'Product 2' },
            ],
        })
    })

    test('should search products', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user',
        })

        await Product.createMany([
            { name: 'Apple', price: 1000, stock: 5 },
            { name: 'Banana', price: 2000, stock: 10 },
        ])

        const cookie = await login(client, user)

        const response = await client.get('/api/products?search=Apple')
            .header('cookie', cookie)

        response.assertStatus(200)
        response.assertBodyContains({
            data: [{ name: 'Apple' }],
        })
        // Should not contain Banana
        const body = response.body()
        if (body.data.find((p: any) => p.name === 'Banana')) {
            throw new Error('Should not contain Banana')
        }
    })

    test('should update product stock', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user',
        })

        const product = await Product.create({
            name: 'Stock Test',
            price: 1000,
            stock: 5,
        })

        const cookie = await login(client, user)

        const response = await client.patch(`/api/products/${product.id}/stock`)
            .header('cookie', cookie)
            .json({
                stock: 20,
            })

        response.assertStatus(200)
        response.assertBodyContains({
            stock: 20,
        })

        const updated = await Product.find(product.id)
        if (updated?.stock !== 20) {
            throw new Error('Stock not updated in DB')
        }
    })

    test('should import products from CSV', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin',
        })

        const cookie = await login(client, user)

        const csvContent = 'name,price,stock,description\nImported Product,5000,100,Imported Description'
        const fs = await import('node:fs')
        const path = await import('node:path')
        const os = await import('node:os')

        const tmpDir = os.tmpdir()
        const filePath = path.join(tmpDir, 'products.csv')
        await fs.promises.writeFile(filePath, csvContent)

        try {
            const response = await client.post('/api/products/import')
                .header('cookie', cookie)
                .file('file', filePath)

            response.assertStatus(201)

            const product = await Product.findBy('name', 'Imported Product')
            if (!product) {
                throw new Error('Product not imported')
            }
            if (product.price !== 5000) {
                throw new Error('Product price incorrect')
            }
        } finally {
            // Cleanup
            try {
                await fs.promises.unlink(filePath)
            } catch { }
        }
    })

    test('should export products to CSV', async ({ client }) => {
        const user = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'admin',
        })

        await Product.createMany([
            { name: 'Export 1', price: 1000, stock: 5 },
            { name: 'Export 2', price: 2000, stock: 10 },
        ])

        const cookie = await login(client, user)

        const response = await client.get('/api/products/export')
            .header('cookie', cookie)

        response.assertStatus(200)
        response.assertHeader('content-type', 'text/csv')
        response.assertHeader('content-disposition', 'attachment; filename="products.csv"')

        const content = response.text()
        if (
            (!content.includes('Export 1') && !content.includes('"Export 1"')) ||
            (!content.includes('Export 2') && !content.includes('"Export 2"'))
        ) {
            throw new Error('CSV content missing products')
        }
    })
})
