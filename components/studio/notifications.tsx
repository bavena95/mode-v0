"use client"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import type { Notification } from "@/hooks/use-notifications"

interface NotificationsProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return CheckCircle
    case "error":
      return AlertCircle
    case "warning":
      return AlertTriangle
    case "info":
      return Info
    default:
      return Info
  }
}

const getNotificationColors = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "border-green-500/50 bg-green-500/10 text-green-400"
    case "error":
      return "border-red-500/50 bg-red-500/10 text-red-400"
    case "warning":
      return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
    case "info":
      return "border-blue-500/50 bg-blue-500/10 text-blue-400"
    default:
      return "border-gray-500/50 bg-gray-500/10 text-gray-400"
  }
}

export function Notifications({ notifications, onRemove }: NotificationsProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type)
        const colors = getNotificationColors(notification.type)

        return (
          <div
            key={notification.id}
            className={`p-4 rounded-xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-right-full duration-300 ${colors}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
                {notification.action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={notification.action.onClick}
                    className="mt-2 h-8 px-3 text-xs hover:bg-white/10"
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(notification.id)}
                className="text-white/60 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
