"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { sk } from "date-fns/locale"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications()
  const [open, setOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifikácie</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              Označiť všetky
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-4 text-center text-gray-500">Načítavam...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Žiadne notifikácie</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.is_read ? "bg-blue-50" : ""}`}
                onClick={() => handleNotificationClick(notification.id, notification.is_read)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-2 flex-1">
                    <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: sk,
                        })}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
              Zobraziť všetky notifikácie
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
