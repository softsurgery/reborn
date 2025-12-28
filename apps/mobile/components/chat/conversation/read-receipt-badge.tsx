import { TouchableOpacity, Text } from "react-native"
import { Check, CheckCheck, AlertCircle } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"

interface ReadReceiptBadgeProps {
  status: "sent" | "delivered" | "read"
  onPress?: () => void
}

export function ReadReceiptBadge({ status, onPress }: ReadReceiptBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "read":
        return <Icon as={CheckCheck} size={14} color="#3b82f6" />
      case "delivered":
        return <Icon as={Check} size={14} color="#6b7280" />
      default:
        return <Icon as={AlertCircle} size={14} color="#9ca3af" />
    }
  }

  const getLabel = () => {
    switch (status) {
      case "read":
        return "Lu"
      case "delivered":
        return "Livré"
      default:
        return "Envoyé"
    }
  }

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center gap-1">
      {getIcon()}
      <Text className="text-xs text-zinc-400">{getLabel()}</Text>
    </TouchableOpacity>
  )
}
