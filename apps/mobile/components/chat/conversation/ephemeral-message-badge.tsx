import { View, Text } from "react-native"
import { Clock } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"

interface EphemeralMessageBadgeProps {
  remainingSeconds: number
  isViewed?: boolean
}

export function EphemeralMessageBadge({ remainingSeconds, isViewed }: EphemeralMessageBadgeProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.ceil(minutes / 60)
    return `${hours}h`
  }

  return (
    <View className="flex-row items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full">
      <Icon as={Clock} size={14} color="#f59e0b" />
      <Text className="text-amber-500 text-xs font-semibold">{formatTime(remainingSeconds)}</Text>
      {isViewed && <Text className="text-amber-500 text-xs ml-1">• Vu</Text>}
    </View>
  )
}
