import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { registerValidator, loginValidator } from '#validators/user'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async register({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const user = await this.authService.register(payload)
      await auth.use('web').login(user)
      
      return response.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages || error.errors
        })
      }
      
      return response.status(500).json({
        message: 'Registration failed',
        error: error.message
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await this.authService.login(email, password)
      await auth.use('web').login(user)
      
      return response.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt,
        }
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages || error.errors
        })
      }
      
      if (error.status === 400) {
        return response.status(400).json({
          message: 'Invalid credentials',
          errors: [{ field: 'general', message: 'Invalid email or password' }]
        })
      }
      
      return response.status(500).json({
        message: 'Login failed',
        error: error.message
      })
    }
  }
}