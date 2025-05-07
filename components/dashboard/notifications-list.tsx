"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Notification } from "@/types"
import { markNotificationAsRead } from "@/lib/actions/notification"
import { Bell } from "lucide-react"

interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [notificationState, setNotificationState] = useState(notifications)

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)

    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  if (notificationState.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No notifications</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notificationState.map((notification) => (
        <div key={notification.id} className={`rounded-lg border p-4 ${!notification.isRead ? "bg-muted/50" : ""}`}>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-medium">{notification.title}</h3>
            <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
          </div>
          <p className="mb-2 text-sm">{notification.message}</p>
          {!notification.isRead && (
            <Button variant="outline" size="sm" className="mt-2" onClick={() => handleMarkAsRead(notification.id)}>
              Mark as read
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
