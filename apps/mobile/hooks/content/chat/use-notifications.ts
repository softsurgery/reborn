"use client"

import { useCallback } from "react"
import { notificationManager } from "@/lib/notification-manager"
import { playSound, type SoundType } from "@/lib/notification-sounds"

export interface UseNotificationsOptions {
  soundEnabled?: boolean
  soundVolume?: number
  vibrationEnabled?: boolean
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { soundEnabled = true, soundVolume = 0.5, vibrationEnabled = true } = options

  const notifyMessage = useCallback(
    (senderName: string, message: string, senderAvatar?: string) => {
      notificationManager.sendMessage(senderName, message, senderAvatar)

      if (soundEnabled) {
        playSound("messageReceived", soundVolume)
      }

      if (vibrationEnabled && "vibrate" in navigator) {
        navigator.vibrate(200)
      }
    },
    [soundEnabled, soundVolume, vibrationEnabled],
  )

  const notifyTyping = useCallback((senderName: string) => {
    notificationManager.sendTypingIndicator(senderName)
  }, [])

  const notifyCustom = useCallback(
    (title: string, body: string, soundType?: SoundType, senderAvatar?: string) => {
      notificationManager.send({
        title,
        body,
        icon: senderAvatar,
      })

      if (soundEnabled && soundType) {
        playSound(soundType, soundVolume)
      }

      if (vibrationEnabled && "vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    },
    [soundEnabled, soundVolume, vibrationEnabled],
  )

  const closeAllNotifications = useCallback(() => {
    notificationManager.closeAll()
  }, [])

  return {
    notifyMessage,
    notifyTyping,
    notifyCustom,
    closeAllNotifications,
  }
}
