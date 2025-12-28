"use client"

import { useState } from "react"

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])

  const triggerNotification = (
    senderName: string,
    messageText: string,
    soundType: "messageReceived" | "messageSent" | "readReceipt" = "messageReceived",
  ) => {
    console.log(`[v0] Notification: ${senderName} - ${messageText}`)

    // Add to notifications stack
    const notification = {
      id: Date.now(),
      senderName,
      messageText,
      soundType,
      timestamp: new Date(),
    }

    setNotifications((prev) => [notification, ...prev])

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }, 3000)
  }

  return { triggerNotification, notifications }
}
