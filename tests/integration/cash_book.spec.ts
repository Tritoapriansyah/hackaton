import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import User from '#models/user'
import CashBook from '#models/cash_book'

test.group('Cash Book | Integration', (group) => {
  group.each.setup(async () => {
    await CashBook.query().delete()
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

  test('should create cash book entry as user', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    const cookie = await login(client, user)

    const response = await client.post('/api/cash-books').header('cookie', cookie).json({
      type: 'masuk',
      amount: 100000,
      description: 'Pemasukan test',
      transactionDate: new Date().toISOString(),
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Cash book entry created successfully',
    })
  })

  test('should get user cash books', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    await CashBook.create({
      userId: user.id,
      type: 'masuk',
      amount: 100000,
      transactionDate: DateTime.now(),
    })

    const cookie = await login(client, user)

    const response = await client.get('/api/cash-books').header('cookie', cookie)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [
        {
          type: 'masuk',
          amount: 100000,
        },
      ],
    })
  })

  test('should get cash book statistics', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    await CashBook.createMany([
      {
        userId: user.id,
        type: 'masuk',
        amount: 100000,
        transactionDate: DateTime.now(),
      },
      {
        userId: user.id,
        type: 'keluar',
        amount: 30000,
        transactionDate: DateTime.now(),
      },
    ])

    const cookie = await login(client, user)

    const response = await client.get('/api/cash-books/statistics').header('cookie', cookie)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        totalMasuk: 100000,
        totalKeluar: 30000,
        balance: 70000,
      },
    })
  })
})
