import { test } from '@japa/runner'
import User from '#models/user'
import Transaksi from '#models/transaksi'
import Produk from '#models/produk'
import Operasional from '#models/operasional'

test.group('HPP | Integration', (group) => {
  group.each.setup(async () => {
    await Transaksi.query().delete()
    await Produk.query().delete()
    await Operasional.query().delete()
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

  test('should calculate HPP', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'admin',
    })

    const product = await Produk.create({
      name: 'Test Product',
      price: 10000,
      hargaBeli: 5000,
      stock: 10,
      description: 'Test',
    })

    await Transaksi.create({
      userId: user.id,
      productId: product.id,
      product: product.name,
      name: 'Test Transaction',
      quantity: 2,
      total: 20000,
      status: 'success',
    })

    await Operasional.create({
      name: 'Listrik',
      price: 5000,
      priode: 'monthly',
    })

    const cookie = await login(client, user)

    const response = await client.get('/api/hpp/calculate').header('cookie', cookie)

    response.assertStatus(200)
    const body = response.body()
    response.assertBodyContains({
      totalRevenue: body.totalRevenue,
      hppProduk: body.hppProduk,
      biayaOperasional: body.biayaOperasional,
      totalHpp: body.totalHpp,
      labaBersih: body.labaBersih,
    })
  })

  test('should get HPP by product', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'admin',
    })

    const product = await Produk.create({
      name: 'Test Product',
      price: 10000,
      hargaBeli: 5000,
      stock: 10,
      description: 'Test',
    })

    await Transaksi.create({
      userId: user.id,
      productId: product.id,
      product: product.name,
      name: 'Test Transaction',
      quantity: 3,
      total: 30000,
      status: 'success',
    })

    const cookie = await login(client, user)

    const response = await client.get(`/api/hpp/product/${product.id}`).header('cookie', cookie)

    response.assertStatus(200)
    const body = response.body()
    response.assertBodyContains({
      product: body.product,
      totalHpp: body.totalHpp,
      laba: body.laba,
      totalQuantity: 3,
    })
  })
})
