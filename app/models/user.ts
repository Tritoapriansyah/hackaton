import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { PasswordSecurityService } from '#services/password_security_service'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare role: 'admin' | 'user'

  /**
   * Set default role before creating user
   */
  @beforeCreate()
  static assignRole(user: User) {
    if (!user.role) {
      user.role = 'user'
    }
  }

  /**
   * Check if user has admin role
   */
  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'admin' | 'user'): boolean {
    return this.role === role
  }

  /**
   * Validate and enhance password security
   */
  static validatePassword(password: string): boolean {
    const passwordService = new PasswordSecurityService()
    const result = passwordService.validatePassword(password)
    return result.valid
  }
}
