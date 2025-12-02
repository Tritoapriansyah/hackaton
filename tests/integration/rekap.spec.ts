import { test } from '@japa/runner'
import User from '#models/user'
import Transaksi from '#models/transaksi'
import Produk from '#models/produk'
import Operasional from '#models/operasional'

test.group('Rekap | Integration', (group) => {
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

  test('should get comprehensive rekap', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'admin',
    })

    const product = await Produk.create({
      name: 'Test Product',
      price: 10000,
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
      price: 50000,
      priode: 'monthly',
    })

    const cookie = await login(client, user)

    const response = await client.get('/api/rekap').header('cookie', cookie)

    response.assertStatus(200)
    const body = response.body()
    response.assertBodyContains({
      penjualan: body.penjualan,
      produk: body.produk,
      operasional: body.operasional,
      summary: body.summary,
    })
  })

  test('should get rekap penjualan', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'admin',
    })

    const product = await Produk.create({
      name: 'Test Product',
      price: 10000,
      stock: 10,
      description: 'Test',
    })

    await Transaksi.create({
      userId: user.id,
      productId: product.id,
      product: product.name,
      name: 'Test Transaction',
      quantity: 1,
      total: 10000,
      status: 'success',
    })

    const cookie = await login(client, user)

    const response = await client.get('/api/rekap/penjualan').header('cookie', cookie)

    response.assertStatus(200)
    const body = response.body()
    response.assertBodyContains({
      totalTransactions: body.totalTransactions,
      totalRevenue: body.totalRevenue,
    })
  })
})
