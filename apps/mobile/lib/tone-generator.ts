import { Vibration } from "react-native"

export const TONE_FREQUENCIES = {
  default: { freq: 800, duration: 300 },
  bell: { freq: 1000, duration: 400 },
  digital: { freq: 600, duration: 250 },
  chime: { freq: 1200, duration: 350 },
  pop: { freq: 900, duration: 200 },
  bubble: { freq: 700, duration: 300 },
  swoosh: { freq: 500, duration: 400 },
  ping: { freq: 1100, duration: 200 },
  soft: { freq: 650, duration: 350 },
} as const

export type ToneId = keyof typeof TONE_FREQUENCIES

interface ToneOptions {
  frequency: number
  duration: number
  volume?: number
  vibration?: boolean
}

export const playTone = async (toneId: ToneId, options?: Partial<ToneOptions>) => {
  try {
    const toneFreq = TONE_FREQUENCIES[toneId]
    const { frequency = toneFreq.freq, duration = toneFreq.duration, volume = 0.5, vibration = true } = options || {}

    console.log(`[v0] Playing tone: ${toneId} (${frequency}Hz, ${duration}ms)`)

    if (vibration) {
      // Create unique vibration pattern for each tone
      const vibrationPattern = getVibrationPattern(toneId, duration)
      Vibration.vibrate(vibrationPattern)
    }
  } catch (error) {
    console.log("[v0] Tone playback error:", error)
  }
}

const getVibrationPattern = (toneId: ToneId, duration: number): number | number[] => {
  const patterns: Record<ToneId, number | number[]> = {
    default: [100, 100, 100],
    bell: [150, 100, 150],
    digital: [50, 50, 50, 50],
    chime: [200, 100, 200],
    pop: [80],
    bubble: [100, 50, 100],
    swoosh: [250, 100],
    ping: [120, 80],
    soft: [150],
  }
  return patterns[toneId]
}

export const stopTone = () => {
  Vibration.cancel()
}

export const getToneName = (toneId: ToneId): string => {
  const toneNames: Record<ToneId, string> = {
    default: "Par défaut",
    bell: "Cloche",
    digital: "Numérique",
    chime: "Carillon",
    pop: "Pop",
    bubble: "Bulle",
    swoosh: "Swoosh",
    ping: "Ping",
    soft: "Douce",
  }
  return toneNames[toneId]
}
