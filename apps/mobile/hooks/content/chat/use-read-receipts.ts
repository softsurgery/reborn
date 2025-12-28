"use client"

import { useEffect, useState } from "react"
import { readReceiptManager, type ReadReceipt, type ReadStatus } from "@/lib/read-receipt-manager"

export const useReadReceipts = (messageId: string) => {
  const [receipts, setReceipts] = useState<ReadReceipt[]>([])
  const [status, setStatus] = useState<ReadStatus>("sent")

  useEffect(() => {
    setReceipts(readReceiptManager.getReceipts(messageId))
    setStatus(readReceiptManager.getReadStatus(messageId))

    const unsubscribe = readReceiptManager.subscribe(messageId, () => {
      setReceipts(readReceiptManager.getReceipts(messageId))
      setStatus(readReceiptManager.getReadStatus(messageId))
    })

    return unsubscribe
  }, [messageId])

  const markAsDelivered = (userId: string, userName: string, userAvatar?: string) => {
    readReceiptManager.updateReceipt(messageId, userId, userName, "delivered", userAvatar)
  }

  const markAsRead = (userId: string, userName: string, userAvatar?: string) => {
    readReceiptManager.updateReceipt(messageId, userId, userName, "read", userAvatar)
  }

  const allRead = readReceiptManager.getAllRead(messageId)

  return {
    receipts,
    status,
    markAsDelivered,
    markAsRead,
    allRead,
  }
}
