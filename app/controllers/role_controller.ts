import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { RoleService } from '#services/role_service'

@inject()
export default class RoleController {
  constructor(protected roleService: RoleService) {}

  /**
   * Get current user's role
   */
  async current({ auth, response }: HttpContext) {
    // Auth middleware ensures user is authenticated
    const user = auth.user!

    return response.ok({
      role: user.role,
      permissions: this.getPermissions(user.role),
    })
  }

  /**
   * Get role statistics (admin only)
   */
  async statistics({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    if (!user.isAdmin) {
      return response.forbidden({ message: 'Admin permission required' })
    }

    try {
      const statistics = await this.roleService.getCountByRole()
      return response.ok({ statistics })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to get role statistics',
        error: error.message,
      })
    }
  }

  /**
   * Get permissions based on role
   */
  private getPermissions(role: string): string[] {
    switch (role) {
      case 'admin':
        return [
          'users.create',
          'users.read',
          'users.update',
          'users.delete',
          'roles.update',
          'system.manage',
        ]
      case 'user':
        return [
          'users.read',
          'profile.update',
          'resources.use',
          'cashbook.create',
          'cashbook.read',
          'cashbook.update',
          'cashbook.delete',
        ]
      default:
        return []
    }
  }
}
