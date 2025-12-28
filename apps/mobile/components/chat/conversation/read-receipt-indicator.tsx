"use client"

import { useEffect, useState } from "react"
import { Check, CheckCheck } from "lucide-react"
import { readReceiptManager, type ReadStatus } from "@/lib/read-receipt-manager"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ReadReceiptIndicatorProps {
  messageId: string
  className?: string
}

export function ReadReceiptIndicator({ messageId, className = "" }: ReadReceiptIndicatorProps) {
  const [status, setStatus] = useState<ReadStatus>("sent")
  const [receipts, setReceipts] = useState<any[]>([])

  useEffect(() => {
    // Initial status
    setStatus(readReceiptManager.getReadStatus(messageId))
    setReceipts(readReceiptManager.getReceipts(messageId))

    // Subscribe to changes
    const unsubscribe = readReceiptManager.subscribe(messageId, () => {
      setStatus(readReceiptManager.getReadStatus(messageId))
      setReceipts(readReceiptManager.getReceipts(messageId))
    })

    return unsubscribe
  }, [messageId])

  const getIcon = () => {
    if (status === "read") {
      return <CheckCheck className={`h-4 w-4 text-blue-500 ${className}`} />
    }
    return <Check className={`h-4 w-4 text-gray-500 ${className}`} />
  }

  if (receipts.length === 0) {
    return getIcon()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {getIcon()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Statut du message</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {receipts.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-gray-500">
              Vu par {receipts.filter((r) => r.status === "read").length}
              {receipts.filter((r) => r.status === "read").length === 1 ? " personne" : " personnes"}
            </DropdownMenuLabel>
            {receipts.map((receipt) => (
              <DropdownMenuItem key={receipt.userId} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={receipt.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{receipt.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{receipt.userName}</div>
                  <div className="text-xs text-gray-500">
                    {receipt.status === "read" ? `Vu ${receipt.timestamp.toLocaleTimeString()}` : "Livré"}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
