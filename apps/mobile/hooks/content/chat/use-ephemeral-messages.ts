"use client"

import { useCallback, useState, useEffect } from "react"
import { ephemeralMessageManager, type EphemeralDuration, type EphemeralMessage } from "@/lib/ephemeral-message-manager"

export const useEphemeralMessages = () => {
  const [messages, setMessages] = useState<EphemeralMessage[]>([])

  useEffect(() => {
    const updateMessages = () => {
      setMessages(ephemeralMessageManager.getAllMessages())
    }

    updateMessages()
    const interval = setInterval(updateMessages, 1000)

    return () => clearInterval(interval)
  }, [])

  const sendEphemeralMessage = useCallback(
    (content: string, senderId: string, senderName: string, duration: EphemeralDuration, senderAvatar?: string) => {
      const id = `msg-${Date.now()}-${Math.random()}`
      return ephemeralMessageManager.createMessage(id, content, senderId, senderName, duration, senderAvatar)
    },
    [],
  )

  const markAsViewed = useCallback((messageId: string) => {
    ephemeralMessageManager.markAsViewed(messageId)
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    ephemeralMessageManager.deleteMessage(messageId)
  }, [])

  return {
    messages,
    sendEphemeralMessage,
    markAsViewed,
    deleteMessage,
  }
}
