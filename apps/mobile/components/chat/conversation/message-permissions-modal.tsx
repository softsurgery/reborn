"use client"

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
  Keyboard,
  ScrollView,
} from "react-native"
import { X, Shield, Lock, Unlock } from "lucide-react-native"
import { Icon } from "~/components/ui/icon"
import { useState } from "react"

interface MessagePermissionsModalProps {
  visible: boolean
  onClose: () => void
  userId?: string
  onPermissionsChange?: (permissions: any) => void
}

export function MessagePermissionsModal({
  visible,
  onClose,
  userId,
  onPermissionsChange,
}: MessagePermissionsModalProps) {
  const [blockUser, setBlockUser] = useState(false)

  const [permissions, setPermissions] = useState({
    send_message: true,
    edit_message: true,
    delete_message: true,
    forward_message: true,
    react_to_message: true,
    reply_to_message: true,
    share_media: true,
    mention_user: true,
    isUserBlocked: false,
  })

  const handleBlockToggle = (value: boolean) => {
    setBlockUser(value)
    const updated = {
      ...permissions,
      isUserBlocked: value,
      ...(value
        ? {
            send_message: false,
            edit_message: false,
            delete_message: false,
            forward_message: false,
            react_to_message: false,
            reply_to_message: false,
            share_media: false,
            mention_user: false,
          }
        : {}),
    }
    setPermissions(updated)
    onPermissionsChange?.(updated)
  }

  const handlePermissionToggle = (permission: keyof typeof permissions) => {
    const updated = {
      ...permissions,
      [permission]: !permissions[permission],
    }
    setPermissions(updated)
    onPermissionsChange?.(updated)
  }

  const handleClose = () => {
    onPermissionsChange?.(permissions)
    onClose()
  }

  const permissionLabels: Record<string, string> = {
    send_message: "Envoyer des messages",
    edit_message: "Modifier les messages",
    delete_message: "Supprimer les messages",
    forward_message: "Transférer les messages",
    react_to_message: "Réagir aux messages",
    reply_to_message: "Répondre aux messages",
    share_media: "Partager les médias",
    mention_user: "Mentionner l'utilisateur",
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/60">
          <View className="flex-1" />
          <View className="bg-zinc-900 rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-800">
              <Text className="text-white text-xl font-bold">Autorisations de messages</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon as={X} size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="px-6 py-4">
              {/* Block User */}
              <View className="bg-red-900/20 rounded-xl p-4 mb-6 border border-red-900/40">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Icon as={blockUser ? Lock : Unlock} size={24} color={blockUser ? "#ef4444" : "#a1a1aa"} />
                    <View className="flex-1">
                      <Text className="text-white font-semibold">Bloquer cet utilisateur</Text>
                      <Text className="text-zinc-400 text-sm mt-1">
                        {blockUser ? "Cet utilisateur est bloqué" : "Empêchez cet utilisateur d'envoyer des messages"}
                      </Text>
                    </View>
                  </View>
                  <Switch value={blockUser} onValueChange={handleBlockToggle} />
                </View>
              </View>

              {/* Role Info */}
              <View className="bg-zinc-800 rounded-xl p-4 mb-6 flex-row items-center gap-3">
                <Icon as={Shield} size={24} color="#3b82f6" />
                <View className="flex-1">
                  <Text className="text-white font-semibold">Rôle utilisateur</Text>
                  <Text className="text-zinc-400 text-sm">Membre</Text>
                </View>
              </View>

              {/* Permissions List */}
              <Text className="text-zinc-400 text-sm font-semibold mb-3 uppercase">Permissions</Text>
              <View className="bg-zinc-800 rounded-xl overflow-hidden">
                {Object.entries(permissions).map(([key, enabled], index) => (
                  <View key={key}>
                    <TouchableOpacity
                      onPress={() => handlePermissionToggle(key as keyof typeof permissions)}
                      disabled={blockUser}
                      className={`flex-row items-center px-4 py-3 justify-between ${blockUser ? "opacity-50" : ""}`}
                    >
                      <Text className="text-white text-sm">{permissionLabels[key]}</Text>
                      <Switch
                        value={enabled}
                        onValueChange={() => handlePermissionToggle(key as keyof typeof permissions)}
                        disabled={blockUser}
                      />
                    </TouchableOpacity>
                    {index < Object.entries(permissions).length - 1 && <View className="h-[0.5px] bg-zinc-700 ml-4" />}
                  </View>
                ))}
              </View>
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
