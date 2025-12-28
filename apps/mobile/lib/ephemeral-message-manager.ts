// Ephemeral messages system - messages that disappear after a set time

export type EphemeralDuration = 5 | 30 | 60 | 300 | 3600 // seconds: 5s, 30s, 1m, 5m, 1h

export interface EphemeralMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  duration: EphemeralDuration
  expiresAt: Date
  viewed: boolean
}

export class EphemeralMessageManager {
  private static instance: EphemeralMessageManager
  private messages: Map<string, EphemeralMessage> = new Map()
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private subscribers: Map<string, Set<() => void>> = new Map()

  private constructor() {}

  static getInstance(): EphemeralMessageManager {
    if (!EphemeralMessageManager.instance) {
      EphemeralMessageManager.instance = new EphemeralMessageManager()
    }
    return EphemeralMessageManager.instance
  }

  createMessage(
    id: string,
    content: string,
    senderId: string,
    senderName: string,
    duration: EphemeralDuration,
    senderAvatar?: string,
  ): EphemeralMessage {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + duration * 1000)

    const message: EphemeralMessage = {
      id,
      content,
      senderId,
      senderName,
      senderAvatar,
      timestamp: now,
      duration,
      expiresAt,
      viewed: false,
    }

    this.messages.set(id, message)

    const timer = setTimeout(() => {
      this.deleteMessage(id)
    }, duration * 1000)

    this.timers.set(id, timer)
    this.notifySubscribers(id)

    return message
  }

  getMessage(id: string): EphemeralMessage | undefined {
    const message = this.messages.get(id)
    if (message && message.expiresAt < new Date()) {
      this.deleteMessage(id)
      return undefined
    }
    return message
  }

  markAsViewed(id: string): void {
    const message = this.messages.get(id)
    if (message) {
      message.viewed = true
      this.notifySubscribers(id)
    }
  }

  deleteMessage(id: string): void {
    const timer = this.timers.get(id)
    if (timer) {
      clearTimeout(timer)
    }

    this.messages.delete(id)
    this.timers.delete(id)
    this.notifySubscribers(id)
  }

  getAllMessages(): EphemeralMessage[] {
    const now = new Date()
    const active = Array.from(this.messages.values()).filter((msg) => msg.expiresAt > now)

    // Clean up expired messages
    this.messages.forEach((msg, id) => {
      if (msg.expiresAt <= now) {
        this.deleteMessage(id)
      }
    })

    return active
  }

  getRemainingTime(id: string): number {
    const message = this.getMessage(id)
    if (!message) return 0

    const remaining = message.expiresAt.getTime() - Date.now()
    return Math.max(0, remaining)
  }

  subscribe(id: string, callback: () => void): () => void {
    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, new Set())
    }

    this.subscribers.get(id)!.add(callback)

    return () => {
      this.subscribers.get(id)?.delete(callback)
    }
  }

  private notifySubscribers(id: string): void {
    const callbacks = this.subscribers.get(id)
    callbacks?.forEach((cb) => cb())
  }
}

export const ephemeralMessageManager = EphemeralMessageManager.getInstance()
