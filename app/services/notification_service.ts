/*
|--------------------------------------------------------------------------
| Notification Service
|--------------------------------------------------------------------------
|
| Service untuk real-time notifications
| - Low stock alerts
| - Transaction notifications
| - System notifications
|
*/

import { inject } from '@adonisjs/core'
import User from '#models/user'
import Produk from '#models/produk'
import Transaksi from '#models/transaksi'
import { DateTime } from 'luxon'

export type NotificationType = 'info' | 'warning' | 'success' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  userId?: number
  data?: any
  read: boolean
  createdAt: DateTime
}

@inject()
export class NotificationService {
  private notifications: Map<number, Notification[]> = new Map()

  /**
   * Create notification
   */
  createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Notification {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      userId,
      data,
      read: false,
      createdAt: DateTime.now(),
    }

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, [])
    }

    const userNotifications = this.notifications.get(userId)!
    userNotifications.unshift(notification)

    // Keep only last 100 notifications per user
    if (userNotifications.length > 100) {
      userNotifications.splice(100)
    }

    return notification
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: number, limit: number = 20): Notification[] {
    const notifications = this.notifications.get(userId) || []
    return notifications.slice(0, limit)
  }

  /**
   * Get unread count
   */
  getUnreadCount(userId: number): number {
    const notifications = this.notifications.get(userId) || []
    return notifications.filter((n) => !n.read).length
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: number, notificationId: string): boolean {
    const notifications = this.notifications.get(userId) || []
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  }

  /**
   * Mark all as read
   */
  markAllAsRead(userId: number): void {
    const notifications = this.notifications.get(userId) || []
    notifications.forEach((n) => {
      n.read = true
    })
  }

  /**
   * Delete notification
   */
  deleteNotification(userId: number, notificationId: string): boolean {
    const notifications = this.notifications.get(userId) || []
    const index = notifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      notifications.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Check low stock and create notifications
   */
  async checkLowStock(threshold: number = 10): Promise<void> {
    const lowStockProducts = await Produk.query().where('stok', '<=', threshold)

    // Get all admin users
    const admins = await User.query().where('role', 'admin')

    for (const product of lowStockProducts) {
      for (const admin of admins) {
        this.createNotification(
          admin.id,
          'warning',
          'Low Stock Alert',
          `Product "${product.name}" is running low. Current stock: ${product.stock}`,
          {
            productId: product.id,
            productName: product.name,
            currentStock: product.stock,
            threshold,
          }
        )
      }
    }
  }

  /**
   * Notify on transaction
   */
  async notifyTransaction(transaction: Transaksi): Promise<void> {
    if (transaction.status === 'success') {
      this.createNotification(
        transaction.userId,
        'success',
        'Transaction Successful',
        `Your transaction of ${transaction.total} has been completed successfully.`,
        {
          transactionId: transaction.id,
          amount: transaction.total,
        }
      )
    } else if (transaction.status === 'failed') {
      this.createNotification(
        transaction.userId,
        'error',
        'Transaction Failed',
        `Your transaction of ${transaction.total} has failed. Please try again.`,
        {
          transactionId: transaction.id,
          amount: transaction.total,
        }
      )
    }
  }

  /**
   * Broadcast notification to all users (admin only)
   */
  async broadcastNotification(
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const users = await User.all()
    for (const user of users) {
      this.createNotification(user.id, type, title, message, data)
    }
  }
}
