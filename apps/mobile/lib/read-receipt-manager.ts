// Read receipt system similar to Messenger

export type ReadStatus = "sent" | "delivered" | "read"

export interface ReadReceipt {
  messageId: string
  userId: string
  userName: string
  userAvatar?: string
  status: ReadStatus
  timestamp: Date
}

export interface MessageWithReadReceipts {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  readReceipts: ReadReceipt[]
}

export class ReadReceiptManager {
  private static instance: ReadReceiptManager
  private receipts: Map<string, ReadReceipt[]> = new Map()
  private subscribers: Map<string, Set<() => void>> = new Map()

  private constructor() {}

  static getInstance(): ReadReceiptManager {
    if (!ReadReceiptManager.instance) {
      ReadReceiptManager.instance = new ReadReceiptManager()
    }
    return ReadReceiptManager.instance
  }

  updateReceipt(messageId: string, userId: string, userName: string, status: ReadStatus, userAvatar?: string): void {
    if (!this.receipts.has(messageId)) {
      this.receipts.set(messageId, [])
    }

    const receipts = this.receipts.get(messageId)!
    const existingIndex = receipts.findIndex((r) => r.userId === userId)

    const newReceipt: ReadReceipt = {
      messageId,
      userId,
      userName,
      userAvatar,
      status,
      timestamp: new Date(),
    }

    if (existingIndex !== -1) {
      receipts[existingIndex] = newReceipt
    } else {
      receipts.push(newReceipt)
    }

    this.notifySubscribers(messageId)
  }

  getReceipts(messageId: string): ReadReceipt[] {
    return this.receipts.get(messageId) || []
  }

  subscribe(messageId: string, callback: () => void): () => void {
    if (!this.subscribers.has(messageId)) {
      this.subscribers.set(messageId, new Set())
    }

    this.subscribers.get(messageId)!.add(callback)

    return () => {
      this.subscribers.get(messageId)?.delete(callback)
    }
  }

  private notifySubscribers(messageId: string): void {
    const callbacks = this.subscribers.get(messageId)
    callbacks?.forEach((cb) => cb())
  }

  getReadStatus(messageId: string): ReadStatus {
    const receipts = this.getReceipts(messageId)
    if (receipts.length === 0) return "sent"
    if (receipts.some((r) => r.status === "read")) return "read"
    return "delivered"
  }

  getAllRead(messageId: string): boolean {
    const receipts = this.getReceipts(messageId)
    return receipts.length > 0 && receipts.every((r) => r.status === "read")
  }
}

export const readReceiptManager = ReadReceiptManager.getInstance()
