"use client"

import { FileAudio } from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"
import { Card } from "@/components/ui/card"

interface MessageWithAudioProps {
  messageContent: string
  audioUrl: string
  audioFileName: string
  senderName: string
  timestamp: Date
  onDownload?: () => void
}

export function MessageWithAudio({
  messageContent,
  audioUrl,
  audioFileName,
  senderName,
  timestamp,
  onDownload,
}: MessageWithAudioProps) {
  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-start gap-2">
        <FileAudio className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{senderName}</div>
          {messageContent && <p className="text-sm text-foreground">{messageContent}</p>}
          <div className="text-xs text-muted-foreground">{timestamp.toLocaleTimeString()}</div>
        </div>
      </div>

      <AudioPlayer src={audioUrl} fileName={audioFileName} onDownload={onDownload} className="mt-2" />
    </Card>
  )
}
