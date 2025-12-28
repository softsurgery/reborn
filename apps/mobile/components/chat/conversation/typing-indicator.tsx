"use client"

import { View, Animated } from "react-native"
import { useEffect, useRef } from "react"

interface TypingIndicatorProps {
  isTyping?: boolean
  userName?: string
}

export function TypingIndicator({ isTyping = true, userName = "Someone" }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!isTyping) {
      // Réinitialiser les animations
      Animated.parallel([
        Animated.timing(dot1, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.timing(dot2, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.timing(dot3, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]).start()
      return
    }

    // Animation en boucle des trois points
    const createAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: false }),
            Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: false }),
          ]),
        ),
      ])
    }

    Animated.parallel([createAnimation(dot1, 0), createAnimation(dot2, 100), createAnimation(dot3, 200)]).start()

    return () => {
      dot1.removeAllListeners()
      dot2.removeAllListeners()
      dot3.removeAllListeners()
    }
  }, [isTyping])

  if (!isTyping) return null

  const translateY = (dot: Animated.Value) =>
    dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8],
    })

  return (
    <View className="flex-row items-center gap-1 px-4 py-2">
      <View className="flex-row items-center gap-1">
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3b82f6",
            transform: [{ translateY: translateY(dot1) }],
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3b82f6",
            transform: [{ translateY: translateY(dot2) }],
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3b82f6",
            transform: [{ translateY: translateY(dot3) }],
          }}
        />
      </View>
    </View>
  )
}
