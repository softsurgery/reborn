"use client"

import { useEffect, useState } from "react"
import { Clock, Eye, EyeOff } from "lucide-react"
import { ephemeralMessageManager, type EphemeralMessage } from "@/lib/ephemeral-message-manager"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EphemeralMessageProps {
  message: EphemeralMessage
  onDelete?: () => void
}

export function EphemeralMessageComponent({ message, onDelete }: EphemeralMessageProps) {
  const [remaining, setRemaining] = useState(0)
  const [isViewed, setIsViewed] = useState(message.viewed)

  useEffect(() => {
    // Update remaining time every second
    const updateRemaining = () => {
      const time = ephemeralMessageManager.getRemainingTime(message.id)
      setRemaining(time)

      if (time <= 0) {
        onDelete?.()
      }
    }

    updateRemaining()
    const interval = setInterval(updateRemaining, 1000)

    // Subscribe to changes
    const unsubscribe = ephemeralMessageManager.subscribe(message.id, () => {
      updateRemaining()
      setIsViewed(message.viewed)
    })

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [message.id, onDelete])

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.ceil(minutes / 60)
    return `${hours}h`
  }

  const progressPercent = ((message.duration * 1000 - remaining) / (message.duration * 1000)) * 100

  return (
    <div className="relative group">
      {/* Progress bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent rounded-lg overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Message content */}
      <div className="relative p-3 rounded-lg bg-background border border-border">
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{message.senderName}</div>
            <div className="text-sm break-words">{message.content}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Disparaît dans {formatTime(remaining)}</span>
            </div>
          </div>

          {/* View status */}
          <div className="flex-shrink-0">
            {isViewed ? <Eye className="h-4 w-4 text-blue-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
          </div>
        </div>

        {/* Viewed indicator */}
        {isViewed && <div className="text-xs text-blue-600 mt-2 ml-10">Vous avez vu ce message</div>}
      </div>
    </div>
  )
}
