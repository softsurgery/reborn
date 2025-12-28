// Message permissions system - control who can do what with messages

export type MessagePermission =
  | "send_message"
  | "edit_message"
  | "delete_message"
  | "forward_message"
  | "react_to_message"
  | "reply_to_message"
  | "share_media"
  | "mention_user"

export type UserRole = "owner" | "admin" | "moderator" | "member" | "guest"

export interface PermissionSet {
  role: UserRole
  permissions: Set<MessagePermission>
  canDeleteOthers: boolean
  canEditOthers: boolean
}

export interface UserPermissions {
  userId: string
  role: UserRole
  customPermissions?: MessagePermission[]
  blocked?: boolean
  restrictedUntil?: Date
}

export class MessagePermissionsManager {
  private static instance: MessagePermissionsManager
  private rolePermissions: Map<UserRole, PermissionSet> = new Map()
  private userPermissions: Map<string, UserPermissions> = new Map()
  private subscribers: Set<() => void> = new Set()

  private constructor() {
    this.initializeDefaultPermissions()
  }

  static getInstance(): MessagePermissionsManager {
    if (!MessagePermissionsManager.instance) {
      MessagePermissionsManager.instance = new MessagePermissionsManager()
    }
    return MessagePermissionsManager.instance
  }

  private initializeDefaultPermissions(): void {
    // Owner permissions
    this.rolePermissions.set("owner", {
      role: "owner",
      permissions: new Set([
        "send_message",
        "edit_message",
        "delete_message",
        "forward_message",
        "react_to_message",
        "reply_to_message",
        "share_media",
        "mention_user",
      ]),
      canDeleteOthers: true,
      canEditOthers: true,
    })

    // Admin permissions
    this.rolePermissions.set("admin", {
      role: "admin",
      permissions: new Set([
        "send_message",
        "edit_message",
        "delete_message",
        "forward_message",
        "react_to_message",
        "reply_to_message",
        "share_media",
        "mention_user",
      ]),
      canDeleteOthers: true,
      canEditOthers: false,
    })

    // Moderator permissions
    this.rolePermissions.set("moderator", {
      role: "moderator",
      permissions: new Set([
        "send_message",
        "edit_message",
        "delete_message",
        "react_to_message",
        "reply_to_message",
        "share_media",
        "mention_user",
      ]),
      canDeleteOthers: true,
      canEditOthers: false,
    })

    // Member permissions
    this.rolePermissions.set("member", {
      role: "member",
      permissions: new Set([
        "send_message",
        "edit_message",
        "delete_message",
        "react_to_message",
        "reply_to_message",
        "share_media",
        "mention_user",
      ]),
      canDeleteOthers: false,
      canEditOthers: false,
    })

    // Guest permissions
    this.rolePermissions.set("guest", {
      role: "guest",
      permissions: new Set(["send_message", "react_to_message", "reply_to_message"]),
      canDeleteOthers: false,
      canEditOthers: false,
    })
  }

  setUserRole(userId: string, role: UserRole): void {
    this.userPermissions.set(userId, {
      userId,
      role,
      blocked: false,
    })
    this.notifySubscribers()
  }

  getUserPermissions(userId: string): UserPermissions {
    return (
      this.userPermissions.get(userId) || {
        userId,
        role: "guest",
        blocked: false,
      }
    )
  }

  canPerform(userId: string, permission: MessagePermission, targetUserId?: string): boolean {
    const userPerm = this.getUserPermissions(userId)

    // Check if user is blocked
    if (userPerm.blocked) {
      return false
    }

    // Check if user has time-based restrictions
    if (userPerm.restrictedUntil && userPerm.restrictedUntil > new Date()) {
      return false
    }

    // Check custom permissions
    if (userPerm.customPermissions?.includes(permission)) {
      return true
    }

    // Check role-based permissions
    const roleSet = this.rolePermissions.get(userPerm.role)
    if (!roleSet) return false

    return roleSet.permissions.has(permission)
  }

  canDeleteMessage(userId: string, messageAuthorId: string): boolean {
    const userPerm = this.getUserPermissions(userId)
    const roleSet = this.rolePermissions.get(userPerm.role)

    if (!roleSet) return false

    // Can always delete your own messages
    if (userId === messageAuthorId) {
      return roleSet.permissions.has("delete_message")
    }

    // Can delete others' messages if permission allows
    return roleSet.canDeleteOthers && roleSet.permissions.has("delete_message")
  }

  canEditMessage(userId: string, messageAuthorId: string): boolean {
    const userPerm = this.getUserPermissions(userId)
    const roleSet = this.rolePermissions.get(userPerm.role)

    if (!roleSet) return false

    // Can always edit your own messages
    if (userId === messageAuthorId) {
      return roleSet.permissions.has("edit_message")
    }

    // Can edit others' messages if permission allows
    return roleSet.canEditOthers && roleSet.permissions.has("edit_message")
  }

  blockUser(userId: string): void {
    const perm = this.getUserPermissions(userId)
    perm.blocked = true
    this.notifySubscribers()
  }

  unblockUser(userId: string): void {
    const perm = this.getUserPermissions(userId)
    perm.blocked = false
    this.notifySubscribers()
  }

  restrictUserTemporarily(userId: string, minutes: number): void {
    const perm = this.getUserPermissions(userId)
    perm.restrictedUntil = new Date(Date.now() + minutes * 60 * 1000)
    this.notifySubscribers()
  }

  removeRestriction(userId: string): void {
    const perm = this.getUserPermissions(userId)
    perm.restrictedUntil = undefined
    this.notifySubscribers()
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb())
  }
}

export const messagePermissionsManager = MessagePermissionsManager.getInstance()
