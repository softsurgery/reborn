"use client"

import { useEffect, useState } from "react"
import { messagePermissionsManager, type MessagePermission } from "@/lib/message-permissions-manager"

export const useMessagePermissions = (userId: string, messageAuthorId?: string) => {
  const [permissions, setPermissions] = useState<Set<MessagePermission>>(new Set())

  useEffect(() => {
    const updatePermissions = () => {
      const userPerms = messagePermissionsManager.getUserPermissions(userId)
      const roleSet = messagePermissionsManager["rolePermissions"]?.get(userPerms.role)
      setPermissions(roleSet?.permissions || new Set())
    }

    updatePermissions()
    const unsubscribe = messagePermissionsManager.subscribe(updatePermissions)

    return unsubscribe
  }, [userId])

  const hasPermission = (permission: MessagePermission) => {
    return messagePermissionsManager.canPerform(userId, permission)
  }

  const canEdit = messageAuthorId ? messagePermissionsManager.canEditMessage(userId, messageAuthorId) : false

  const canDelete = messageAuthorId ? messagePermissionsManager.canDeleteMessage(userId, messageAuthorId) : false

  return {
    permissions,
    hasPermission,
    canEdit,
    canDelete,
  }
}
