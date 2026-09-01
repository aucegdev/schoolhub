import { useEffect, useState } from "react";
import { Bell, Check, Calendar, AlertTriangle, BookOpen, Info, X } from "lucide-react";
import {
  listNotifications,
  markAsRead,
  markAllAsRead,
  type NotificationItem,
} from "../../services/notification";
import { subscribeToNotifications } from "../../services/socket";
import { triggerCelebrationConfetti } from "../3d/CelebrationConfetti";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<NotificationItem | null>(null);

  useEffect(() => {
    loadNotifications();

    // Subscribe to real-time WebSockets notifications
    const unsubscribe = subscribeToNotifications((newNotif: NotificationItem) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setToastMessage(newNotif);

      if (newNotif.type === "LEAVE_STATUS" && newNotif.title.includes("APPROVED")) {
        triggerCelebrationConfetti();
      }

      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch {}
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "LEAVE_STATUS":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "ATTENDANCE_ALERT":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "EXAM_ANNOUNCEMENT":
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-indigo-500/40 flex items-start gap-3 max-w-sm animate-slide-up">
          <div className="p-2 bg-indigo-600/30 rounded-lg">{getTypeIcon(toastMessage.type)}</div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-sm text-indigo-200">{toastMessage.title}</div>
            <div className="text-xs text-slate-300">{toastMessage.message}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>Notice Center</span>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-4 transition cursor-pointer hover:bg-slate-50 flex gap-3 ${
                    !n.isRead ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-xs h-fit">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-xs text-slate-800 flex justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 leading-snug">{n.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
