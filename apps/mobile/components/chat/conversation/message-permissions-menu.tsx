"use client"

import { useEffect, useState } from "react"
import { Shield, LockIcon, Edit, Trash2, Share2, Reply } from "lucide-react"
import { messagePermissionsManager } from "@/lib/message-permissions-manager"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface MessagePermissionsMenuProps {
  userId: string
  messageAuthorId: string
  messageId: string
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onReply?: () => void
  onReact?: () => void
}

export function MessagePermissionsMenu({
  userId,
  messageAuthorId,
  messageId,
  onEdit,
  onDelete,
  onShare,
  onReply,
  onReact,
}: MessagePermissionsMenuProps) {
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [canReply, setCanReply] = useState(false)
  const [canReact, setCanReact] = useState(false)

  useEffect(() => {
    const updatePermissions = () => {
      setCanEdit(messagePermissionsManager.canEditMessage(userId, messageAuthorId))
      setCanDelete(messagePermissionsManager.canDeleteMessage(userId, messageAuthorId))
      setCanShare(messagePermissionsManager.canPerform(userId, "share_media"))
      setCanReply(messagePermissionsManager.canPerform(userId, "reply_to_message"))
      setCanReact(messagePermissionsManager.canPerform(userId, "react_to_message"))
    }

    updatePermissions()
    const unsubscribe = messagePermissionsManager.subscribe(updatePermissions)

    return unsubscribe
  }, [userId, messageAuthorId])

  return (
    <DropdownMenu>
      <Button variant="ghost" size="sm">
        <Shield className="h-4 w-4" />
      </Button>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions disponibles</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {canEdit && (
          <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </DropdownMenuItem>
        )}

        {canDelete && (
          <DropdownMenuItem onClick={onDelete} className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </DropdownMenuItem>
        )}

        {canShare && (
          <DropdownMenuItem onClick={onShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </DropdownMenuItem>
        )}

        {canReply && (
          <DropdownMenuItem onClick={onReply} className="flex items-center gap-2">
            <Reply className="h-4 w-4" />
            <span>Répondre</span>
          </DropdownMenuItem>
        )}

        {canReact && (
          <DropdownMenuItem onClick={onReact} className="flex items-center gap-2">
            <span>👍 Réagir</span>
          </DropdownMenuItem>
        )}

        {!canEdit && !canDelete && !canShare && !canReply && !canReact && (
          <DropdownMenuItem disabled className="flex items-center gap-2">
            <LockIcon className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Accès limité</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
