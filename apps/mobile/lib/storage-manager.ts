import AsyncStorage from "@react-native-async-storage/async-storage"

export interface ChatSettings {
  readReceiptsEnabled: boolean
  typingIndicatorEnabled: boolean
  autoSavePhotos: boolean
  ephemeralEnabled: boolean
  ephemeralDuration: number
  soundSettings: {
    notificationMuted: boolean
    callMuted: boolean
    notificationTone: string
    messageTone: string
    vibrationEnabled: boolean
  }
}

const DEFAULT_SETTINGS: ChatSettings = {
  readReceiptsEnabled: true,
  typingIndicatorEnabled: true,
  autoSavePhotos: false,
  ephemeralEnabled: false,
  ephemeralDuration: 60,
  soundSettings: {
    notificationMuted: false,
    callMuted: false,
    notificationTone: "default",
    messageTone: "default",
    vibrationEnabled: true,
  },
}

export const storageManager = {
  async loadSettings(): Promise<ChatSettings> {
    try {
      const stored = await AsyncStorage.getItem("chatSettings")
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
      return DEFAULT_SETTINGS
    }
  },

  async saveSettings(settings: ChatSettings): Promise<void> {
    try {
      await AsyncStorage.setItem("chatSettings", JSON.stringify(settings))
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
    }
  },

  async updateReadReceipts(enabled: boolean): Promise<void> {
    const settings = await this.loadSettings()
    settings.readReceiptsEnabled = enabled
    await this.saveSettings(settings)
  },

  async updateTypingIndicator(enabled: boolean): Promise<void> {
    const settings = await this.loadSettings()
    settings.typingIndicatorEnabled = enabled
    await this.saveSettings(settings)
  },

  async updateAutoSavePhotos(enabled: boolean): Promise<void> {
    const settings = await this.loadSettings()
    settings.autoSavePhotos = enabled
    await this.saveSettings(settings)
  },

  async updateEphemeralMessages(enabled: boolean, duration: number): Promise<void> {
    const settings = await this.loadSettings()
    settings.ephemeralEnabled = enabled
    settings.ephemeralDuration = duration
    await this.saveSettings(settings)
  },

  async updateSoundSettings(soundSettings: ChatSettings["soundSettings"]): Promise<void> {
    const settings = await this.loadSettings()
    settings.soundSettings = soundSettings
    await this.saveSettings(settings)
  },

  async loadMessagePermissions(conversationId: string) {
    try {
      const key = `messagePermissions_${conversationId}`
      const stored = await AsyncStorage.getItem(key)
      return stored
        ? JSON.parse(stored)
        : {
            send_message: true,
            edit_message: true,
            delete_message: true,
            forward_message: true,
            react_to_message: true,
            reply_to_message: true,
            share_media: true,
            mention_user: true,
            isUserBlocked: false,
          }
    } catch (error) {
      console.error("[v0] Error loading message permissions:", error)
      return {
        send_message: true,
        edit_message: true,
        delete_message: true,
        forward_message: true,
        react_to_message: true,
        reply_to_message: true,
        share_media: true,
        mention_user: true,
        isUserBlocked: false,
      }
    }
  },

  async saveMessagePermissions(conversationId: string, permissions: any): Promise<void> {
    try {
      const key = `messagePermissions_${conversationId}`
      await AsyncStorage.setItem(key, JSON.stringify(permissions))
    } catch (error) {
      console.error("[v0] Error saving message permissions:", error)
    }
  },
}
