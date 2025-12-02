import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Role middleware for role-based access control
 */
export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, options?: string[]) {
    const user = await auth.user

    // User must be authenticated
    if (!user) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    // If roles are specified, check if user has one of the required roles
    if (options && options.length > 0) {
      const userRoles = options
      const hasValidRole = userRoles.includes(user.role)

      if (!hasValidRole) {
        return response.forbidden({
          message: 'Insufficient permissions',
          required: options,
          current: user.role,
        })
      }
    }

    return next()
  }
}
