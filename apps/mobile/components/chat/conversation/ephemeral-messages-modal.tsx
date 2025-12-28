"use client"

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch,
} from "react-native"
import { X, Clock } from "lucide-react-native"
import { Icon } from "~/components/ui/icon"
import { useState } from "react"

interface EphemeralMessagesModalProps {
  visible: boolean
  onClose: () => void
  enabled?: boolean
  duration?: number
  onEphemeralStateChange?: (enabled: boolean, duration: number) => void
}

export function EphemeralMessagesModal({
  visible,
  onClose,
  enabled = false,
  duration = 60,
  onEphemeralStateChange,
}: EphemeralMessagesModalProps) {
  const [ephemeralEnabled, setEphemeralEnabled] = useState(enabled)
  const [selectedDuration, setSelectedDuration] = useState<5 | 30 | 60 | 300 | 3600>(duration as any)

  const handleClose = () => {
    onEphemeralStateChange?.(ephemeralEnabled, selectedDuration)
    onClose()
  }

  const handleToggle = (newValue: boolean) => {
    setEphemeralEnabled(newValue)
  }

  const handleDurationChange = (newDuration: 5 | 30 | 60 | 300 | 3600) => {
    setSelectedDuration(newDuration)
  }

  const durations = [
    { value: 5, label: "5 secondes" },
    { value: 30, label: "30 secondes" },
    { value: 60, label: "1 minute" },
    { value: 300, label: "5 minutes" },
    { value: 3600, label: "1 heure" },
  ]

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/60">
          <View className="flex-1" />
          <View className="bg-zinc-900 rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-800">
              <Text className="text-white text-xl font-bold">Messages éphémères</Text>
              <TouchableOpacity onPress={handleClose}>
                <Icon as={X} size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="px-6 py-6">
              {/* Info */}
              <View className="bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-900/40">
                <View className="flex-row gap-3">
                  <Icon as={Clock} size={24} color="#3b82f6" />
                  <View className="flex-1">
                    <Text className="text-blue-400 font-semibold">Messages éphémères</Text>
                    <Text className="text-blue-300/80 text-sm mt-1">
                      Les messages disparaîtront automatiquement après le délai configuré
                    </Text>
                  </View>
                </View>
              </View>

              {/* Enable Toggle */}
              <View className="flex-row items-center justify-between py-4 mb-6 border-b border-zinc-800">
                <Text className="text-white font-semibold">Activer les messages éphémères</Text>
                <Switch value={ephemeralEnabled} onValueChange={handleToggle} />
              </View>

              {/* Duration Selection */}
              {ephemeralEnabled && (
                <View>
                  <Text className="text-zinc-400 text-sm font-semibold mb-3 uppercase">Durée avant suppression</Text>
                  <View className="bg-zinc-800 rounded-xl overflow-hidden">
                    {durations.map((item, index) => (
                      <TouchableOpacity
                        key={item.value}
                        onPress={() => handleDurationChange(item.value as any)}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          selectedDuration === item.value ? "bg-blue-600/20" : ""
                        }`}
                      >
                        <Text
                          className={selectedDuration === item.value ? "text-blue-400 font-semibold" : "text-white"}
                        >
                          {item.label}
                        </Text>
                        {selectedDuration === item.value && <View className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity onPress={handleClose} className="mx-6 mb-6 bg-blue-600 py-3 rounded-xl">
              <Text className="text-white text-center font-semibold">Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
