/*
|--------------------------------------------------------------------------
| Notifications Controller
|--------------------------------------------------------------------------
|
| Controller untuk notification endpoints
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  /**
   * Get user notifications
   * GET /api/notifications
   */
  async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const limit = request.input('limit', 20)

      const notifications = this.notificationService.getUserNotifications(user.id, limit)
      const unreadCount = this.notificationService.getUnreadCount(user.id)

      return response.ok({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch notifications',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Mark notification as read
   * PATCH /api/notifications/:id/read
   */
  async markAsRead({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { id } = params

      const success = this.notificationService.markAsRead(user.id, id)

      if (!success) {
        return response.notFound({
          success: false,
          message: 'Notification not found',
        })
      }

      return response.ok({
        success: true,
        message: 'Notification marked as read',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to mark notification as read',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Mark all notifications as read
   * PATCH /api/notifications/read-all
   */
  async markAllAsRead({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      this.notificationService.markAllAsRead(user.id)

      return response.ok({
        success: true,
        message: 'All notifications marked as read',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { id } = params

      const success = this.notificationService.deleteNotification(user.id, id)

      if (!success) {
        return response.notFound({
          success: false,
          message: 'Notification not found',
        })
      }

      return response.ok({
        success: true,
        message: 'Notification deleted',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete notification',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get unread count
   * GET /api/notifications/unread-count
   */
  async unreadCount({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      const count = this.notificationService.getUnreadCount(user.id)

      return response.ok({
        success: true,
        data: {
          unreadCount: count,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to get unread count',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
