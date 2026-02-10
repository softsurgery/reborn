"use client"

import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Bell, X } from "lucide-react-native"
import { Icon } from "~/components/ui/icon"
import { useEffect, useRef, useState } from "react"

interface NotificationBannerProps {
  title: string
  message: string
  type?: "success" | "info" | "warning" | "error"
  duration?: number
  onDismiss?: () => void
}

export function NotificationBanner({
  title,
  message,
  type = "info",
  duration = 5000,
  onDismiss,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true)
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false)
        onDismiss?.()
      })
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-900/80"
      case "error":
        return "bg-red-900/80"
      case "warning":
        return "bg-yellow-900/80"
      default:
        return "bg-blue-900/80"
    }
  }

  return (
    <Animated.View
      style={{
        opacity: slideAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            }),
          },
        ],
      }}
      className={`${getBgColor()} mx-4 mt-4 px-4 py-3 rounded-xl flex-row items-center justify-between`}
    >
      <View className="flex-row items-center flex-1">
        <Icon as={Bell} size={20} color="white" />
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold">{title}</Text>
          <Text className="text-white/80 text-xs mt-1">{message}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Icon as={X} size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  )
}
