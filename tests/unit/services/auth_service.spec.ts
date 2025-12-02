import { test } from '@japa/runner'
import { AuthService } from '#services/auth_service'
import User from '#models/user'

test.group('Auth Service | Unit', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should register a new user', async ({ assert }) => {
    const authService = new AuthService()

    const user = await authService.register({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      phone: '+1234567890',
    })

    assert.exists(user.id)
    assert.equal(user.email, 'test@example.com')
    assert.equal(user.fullName, 'Test User')
    assert.equal(user.role, 'user')
  })

  test('should login with valid credentials', async ({ assert }) => {
    const authService = new AuthService()

    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    })

    const user = await authService.login('test@example.com', 'Password123!')

    assert.exists(user)
    assert.equal(user.email, 'test@example.com')
  })

  test('should throw error with invalid credentials', async ({ assert }) => {
    const authService = new AuthService()

    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    })

    await assert.rejects(
      () => authService.login('test@example.com', 'WrongPassword'),
      'Invalid credentials'
    )
  })
})
