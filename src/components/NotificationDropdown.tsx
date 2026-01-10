import { useNotifications } from "@/contexts/NotificationContext";
import { Bell, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NotificationDropdown = () => {
  const { notifications, removeNotification, clearNotifications, unreadCount } = useNotifications();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-l-4 border-l-red-500";
      case "warning":
        return "bg-amber-50 border-l-4 border-l-amber-500";
      case "success":
        return "bg-emerald-50 border-l-4 border-l-emerald-500";
      case "info":
        return "bg-blue-50 border-l-4 border-l-blue-500";
      default:
        return "bg-slate-50 border-l-4 border-l-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "warning":
        return "text-amber-600";
      case "success":
        return "text-emerald-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="w-96 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-slate-700" />
          <h3 className="font-semibold text-slate-900">Notificações</h3>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearNotifications}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            <Trash2 size={14} className="mr-1" /> Limpar
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg flex items-start gap-3 transition-all",
                getTypeStyles(notification.type)
              )}
            >
              <div className={cn("mt-0.5", getTypeIcon(notification.type))}>
                {notification.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{notification.title}</p>
                <p className="text-slate-700 text-xs mt-0.5">{notification.message}</p>
                {notification.timestamp && (
                  <p className="text-slate-500 text-xs mt-1">
                    {notification.timestamp.toLocaleTimeString("pt-BR")}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
