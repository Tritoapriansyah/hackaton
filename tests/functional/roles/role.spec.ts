import { test } from '@japa/runner'
import User from '#models/user'

test.group('Role System', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should prevent access without authentication', async ({ client }) => {
    const response = await client.get('/api/roles/current')

    response.assertStatus(401)
  })

  test('should get current user role successfully', async ({ client }) => {
    // Create and login a user
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '081234567890',
      role: 'user',
    })

    // Login to get session
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'password123',
    })
    loginResponse.assertStatus(200)

    // Extract session cookie
    const cookies = loginResponse.headers()['set-cookie']

    // Make authenticated request
    const response = await client
      .get('/api/roles/current')
      .header('cookie', cookies?.map(c => c.split(';')[0]).join('; ') || '')

    response.assertStatus(200)
    response.assertBodyContains({
      role: 'user',
      permissions: [
        'users.read',
        'profile.update',
        'resources.use',
      ],
    })
  })

  test('should get statistics as admin', async ({ client, assert }) => {
    // Create admin user
    await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    })

    // Create some regular users
    await User.create({
      fullName: 'User 1',
      email: 'user1@example.com',
      password: 'password123',
      role: 'user',
    })

    // Login as admin
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'admin@example.com',
      password: 'password123',
    })

    // Check if login was successful
    if (loginResponse.response.statusCode !== 200) {
      console.log('Login failed:', loginResponse.response.statusCode, loginResponse.body())
    }

    loginResponse.assertStatus(200)
    const cookies = loginResponse.headers()['set-cookie']
    assert.exists(cookies, 'Expected set-cookie header to be present')

    const response = await client
      .get('/api/roles/statistics')
      .header('cookie', cookies?.map(c => c.split(';')[0]).join('; ') || '')

    response.assertStatus(200)
    response.assertBodyContains({
      statistics: {
        admin: 1,
        user: 1,
      },
    })
  })

  test('should deny statistics access to regular users', async ({ client, assert }) => {
    await User.create({
      fullName: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    // Login as regular user
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'user@example.com',
      password: 'password123',
    })
    loginResponse.assertStatus(200)
    const cookies = loginResponse.headers()['set-cookie']
    assert.exists(cookies, 'Expected set-cookie header to be present')

    const response = await client
      .get('/api/roles/statistics')
      .header('cookie', cookies?.map(c => c.split(';')[0]).join('; ') || '')

    response.assertStatus(403)
  })
})