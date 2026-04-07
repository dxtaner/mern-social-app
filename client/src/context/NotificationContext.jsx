import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    // 🔥 TOKEN YOKSA ÇALIŞMA
    if (!user?.token) return;

    setLoading(true);
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(
          "Bildirimler yüklenemedi:",
          err.response?.data || err.message,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Bildirim okunamadı:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
