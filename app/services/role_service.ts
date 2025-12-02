import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'

export class RoleService {
  /**
   * Check if user has specific role
   */
  hasRole(user: User, role: string): boolean {
    return user.role === role
  }

  /**
   * Check if user has one of the specified roles
   */
  hasAnyRole(user: User, roles: string[]): boolean {
    return roles.includes(user.role)
  }

  /**
   * Update user role
   */
  async updateRole(userId: number, newRole: 'admin' | 'user'): Promise<User> {
    const user = await User.findOrFail(userId)

    // Validate the new role
    if (!['admin', 'user'].includes(newRole)) {
      throw new Exception('Invalid role.', { status: 400 })
    }

    user.role = newRole
    await user.save()

    return user
  }

  /**
   * Get all users by role
   */
  async getUsersByRole(role: 'admin' | 'user'): Promise<User[]> {
    if (!['admin', 'user'].includes(role)) {
      throw new Exception('Invalid role.', { status: 400 })
    }

    return User.query().where('role', role)
  }

  /**
   * Get count of users by role
   */
  async getCountByRole(): Promise<{ admin: number; user: number }> {
    const [adminCount, userCount] = await Promise.all([
      User.query().where('role', 'admin').count('* as count'),
      User.query().where('role', 'user').count('* as count'),
    ])

    return {
      admin: Number(adminCount[0].$extras.count),
      user: Number(userCount[0].$extras.count),
    }
  }
}
