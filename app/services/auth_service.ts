import User from '#models/user'
import type { Infer } from '@vinejs/vine/types'
import { registerValidator } from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'

export class AuthService {
  async register(payload: Infer<typeof registerValidator>) {
    const user = await User.create({
      ...payload,
      role: 'user', // Set default role
    })
    return user
  }

  async login(email: string, password: string) {
    try {
      const user = await User.verifyCredentials(email, password)
      return user
    } catch (error) {
      throw new Exception('Invalid credentials', {
        status: 400,
        code: 'E_INVALID_CREDENTIALS',
      })
    }
  }
}
