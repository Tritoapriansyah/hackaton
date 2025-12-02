import { test } from '@japa/runner'
import User from '#models/user'
import Operasional from '#models/operasional'

test.group('Operasional | Integration', (group) => {
  group.each.setup(async () => {
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

  test('should create operasional as admin', async ({ client }) => {
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    })

    const cookie = await login(client, admin)

    const response = await client.post('/api/operasional').header('cookie', cookie).json({
      name: 'Listrik',
      price: 500000,
      description: 'Biaya listrik bulanan',
      priode: 'monthly',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Operasional created successfully',
    })
  })

  test('should reject non-admin from creating operasional', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    const cookie = await login(client, user)

    const response = await client.post('/api/operasional').header('cookie', cookie).json({
      name: 'Listrik',
      price: 500000,
      priode: 'monthly',
    })

    response.assertStatus(403)
  })

  test('should get all operasional entries', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    await Operasional.createMany([
      { name: 'Listrik', price: 500000, priode: 'monthly' },
      { name: 'Gas', price: 200000, priode: 'monthly' },
    ])

    const cookie = await login(client, user)

    const response = await client.get('/api/operasional').header('cookie', cookie)

    response.assertStatus(200)
    response.assertBodyContains({
      data: response.body().data,
    })
  })
})
