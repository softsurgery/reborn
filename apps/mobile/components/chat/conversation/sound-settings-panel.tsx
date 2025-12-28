"use client"

import { SetStateAction, useState } from "react"
import { Volume2, VolumeX, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { playSound, type SoundType } from "@/lib/notification-sounds"

interface SoundSettingsPanelProps {
  onClose?: () => void
}

export function SoundSettingsPanel({ onClose }: SoundSettingsPanelProps) {
  const [masterVolume, setMasterVolume] = useState(0.5)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundType, setSoundType] = useState<SoundType>("messageReceived")

  const soundTypes: { value: SoundType; label: string }[] = [
    { value: "messageReceived", label: "Message reçu" },
    { value: "messageSent", label: "Message envoyé" },
    { value: "typingIndicator", label: "Quelqu'un écrit" },
    { value: "readReceipt", label: "Message lu" },
  ]

  const handleTestSound = () => {
    playSound(soundType, masterVolume)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Paramètres audio
        </CardTitle>
        <CardDescription>Configurez les sons et les notifications</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Volume principal</label>
            <span className="text-xs text-muted-foreground">{Math.round(masterVolume * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider value={[masterVolume]} max={1} step={0.05} onValueChange={(v: SetStateAction<number>[]) => setMasterVolume(v[0])} />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium block">Notifications sonores</label>
            <p className="text-xs text-muted-foreground">Activer/désactiver tous les sons</p>
          </div>
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sound type selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium block">Type de son</label>
          <div className="grid grid-cols-2 gap-2">
            {soundTypes.map((type) => (
              <Button
                key={type.value}
                variant={soundType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSoundType(type.value)}
                className="justify-start"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Test button */}
        <Button onClick={handleTestSound} disabled={!notificationsEnabled} className="w-full">
          Tester le son
        </Button>

        {onClose && (
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Fermer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
