import { Audio } from "expo-av"
import { Vibration } from "react-native"

const TONES = {
  default: require("../assets/sounds/default.mp3"),
  bell: require("../assets/sounds/bell.mp3"),
  digital: require("../assets/sounds/digital.mp3"),
  chime: require("../assets/sounds/chime.mp3"),
  pop: require("../assets/sounds/pop.mp3"),
  bubble: require("../assets/sounds/bubble.mp3"),
  swoosh: require("../assets/sounds/swoosh.mp3"),
  ping: require("../assets/sounds/ping.mp3"),
  soft: require("../assets/sounds/soft.mp3"),
} as const

export type ToneId = keyof typeof TONES

let currentSound: Audio.Sound | null = null

export const playTone = async (
  toneId: ToneId,
  options?: { vibration?: boolean; volume?: number }
) => {
  try {
    if (currentSound) {
      await currentSound.unloadAsync()
      currentSound = null
    }

    const { vibration = true, volume = 0.7 } = options || {}

    const { sound } = await Audio.Sound.createAsync(
      TONES[toneId],
      {
        shouldPlay: true,
        volume,
      }
    )

    currentSound = sound

    if (vibration) {
      Vibration.vibrate([80, 60, 80])
    }

    sound.setOnPlaybackStatusUpdate((status: { isLoaded: any; didJustFinish: any }) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync()
        currentSound = null
      }
    })
  } catch (e) {
    console.log("Tone error", e)
  }
}

export const stopTone = async () => {
  if (currentSound) {
    await currentSound.unloadAsync()
    currentSound = null
  }
  Vibration.cancel()
}
