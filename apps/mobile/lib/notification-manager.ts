// Notification management system similar to Messenger

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
  timestamp?: number
  data?: Record<string, any>
}

export class NotificationManager {
  private static instance: NotificationManager
  private notificationQueue: any[] = []

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  send(options: NotificationOptions): void {
    try {
      console.log(`[v0] Notification: ${options.title} - ${options.body}`)

      const notification = {
        id: Date.now(),
        ...options,
        timestamp: new Date(),
      }

      this.notificationQueue.push(notification)

      // Keep only last 10 notifications in memory
      if (this.notificationQueue.length > 10) {
        this.notificationQueue.shift()
      }
    } catch (error) {
      console.log("[v0] Notification error:", error)
    }
  }

  sendMessage(senderName: string, message: string): void {
    this.send({
      title: `Message de ${senderName}`,
      body: message,
    })
  }

  sendTypingIndicator(senderName: string): void {
    this.send({
      title: `${senderName} est en train d'écrire...`,
      body: "...",
    })
  }

  closeAll(): void {
    this.notificationQueue = []
  }

  getNotifications(): any[] {
    return this.notificationQueue
  }
}

export const notificationManager = NotificationManager.getInstance()
