import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth | Login', (group) => {
    group.each.setup(async () => {
        await User.query().delete()
    })

    test('should login with valid credentials', async ({ client }) => {
        await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        })

        const response = await client.post('/api/auth/login').json({
            email: 'test@example.com',
            password: 'password123',
        })

        response.assertStatus(200)
        response.assertBodyContains({
            message: 'Login successful',
            user: {
                email: 'test@example.com',
            },
        })
    })

    test('should fail with invalid credentials', async ({ client }) => {
        await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        })

        const response = await client.post('/api/auth/login').json({
            email: 'test@example.com',
            password: 'wrongpassword',
        })

        // AdonisJS Auth mixin throws an error which is handled by the global exception handler.
        // Typically returns 400 Bad Request for invalid credentials.
        response.assertStatus(400)
    })
})
