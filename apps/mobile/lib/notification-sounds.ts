// Sound effects library for Messenger-like notifications

import { Vibration } from "react-native"

export const NOTIFICATION_SOUNDS = {
  messageReceived: {
    name: "Message reçu",
    duration: 2000,
  },
  messageSent: {
    name: "Message envoyé",
    duration: 1500,
  },
  typingIndicator: {
    name: "Quelqu'un écrit",
    duration: 800,
  },
  readReceipt: {
    name: "Message lu",
    duration: 600,
  },
} as const

export type SoundType = keyof typeof NOTIFICATION_SOUNDS

export const playSound = (soundType: SoundType, volume = 0.5) => {
  try {
    console.log(`[v0] Playing sound: ${soundType}`)

    const sound = NOTIFICATION_SOUNDS[soundType]
    const vibrationPattern = soundType === "messageReceived" ? [0, 200, 100, 200] : [0, 100]

    Vibration.vibrate(vibrationPattern)
  } catch (error) {
    console.log("[v0] Sound playback error:", error)
  }
}

export const stopSound = () => {
  Vibration.cancel()
}
