"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { playSound, type SoundType } from "@/lib/notification-sounds"

export interface AudioNotificationOptions {
  volume?: number
  vibrate?: boolean | number[]
  enabled?: boolean
}

export const useAudioNotifications = (options: AudioNotificationOptions = {}) => {
  const { volume = 0.5, vibrate = true, enabled = true } = options
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if audio is supported
    const audioTest = new Audio()
    if (audioTest.play === undefined) {
      setIsSupported(false)
    }
  }, [])

  const playNotificationSound = useCallback(
    (soundType: SoundType) => {
      if (!enabled || !isSupported) return

      playSound(soundType, volume)

      // Add vibration feedback
      if (vibrate && "vibrate" in navigator) {
        if (Array.isArray(vibrate)) {
          navigator.vibrate(vibrate)
        } else {
          navigator.vibrate(200)
        }
      }
    },
    [enabled, isSupported, volume, vibrate],
  )

  const playCustomSound = useCallback(
    (audioUrl: string, customVolume?: number) => {
      if (!enabled || !isSupported) return

      try {
        const audio = new Audio(audioUrl)
        audio.volume = customVolume ?? volume
        audio.play().catch((error) => {
          console.log("[v0] Custom sound playback failed:", error)
        })
      } catch (error) {
        console.log("[v0] Error playing custom sound:", error)
      }
    },
    [enabled, isSupported, volume],
  )

  const playTone = useCallback(
    (frequency: number, duration = 200) => {
      if (!enabled || !isSupported) return

      try {
        // Create audio context for tone generation
        const audioContext =
          audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
      } catch (error) {
        console.log("[v0] Tone generation error:", error)
      }
    },
    [enabled, isSupported, volume],
  )

  return {
    playNotificationSound,
    playCustomSound,
    playTone,
    isSupported,
  }
}
