import { test } from '@japa/runner'
import User from '#models/user'
import client from '@japa/client'

// Create test user
test.group('Debug Auth Flow', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
    await User.create({
      fullName: 'Debug User',
      email: 'debug@example.com',
      password: 'password123',
      role: 'admin',
    })
  })

  test('debug complete auth flow', async ({ assert }) => {
    // Step 1: Login
    console.log('Step 1: Login')
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'debug@example.com',
      password: 'password123',
    })
    
    console.log('Login response:', loginResponse.status(), await loginResponse.json())
    
    // Step 2: Get current user role
    console.log('Step 2: Get current user role')
    const cookieHeaders = loginResponse.headers()['set-cookie']
    console.log('Cookie headers:', cookieHeaders)
    
    const roleResponse = await client
      .get('/api/roles/current')
      .headers({ 'cookie': cookieHeaders.join('; ') })
    
    console.log('Role response:', roleResponse.status(), await roleResponse.json())
    
    assert.equal(roleResponse.status(), 200)
  })
})