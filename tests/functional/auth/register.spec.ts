import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth | Register', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should register a new user', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '081234567890',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'User created successfully',
      user: {
        email: 'test@example.com',
        fullName: 'Test User',
      },
    })
  })

  test('should fail validation when email is invalid', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      fullName: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          message: 'The email field must be a valid email address',
        },
      ],
    })
  })

  test('should fail validation when password is too short', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'short',
    })

    response.assertStatus(422)
  })
})
