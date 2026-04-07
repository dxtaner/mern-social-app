import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const { user: authUser, updateUser } = useAuth();

  const fetchAllUsers = useCallback(async () => {
    // 🔥 TOKEN YOKSA ÇALIŞMA
    if (!authUser?.token) return;

    setUsersLoading(true);
    try {
      const res = await API.get("/users/all");
      setAllUsers(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Kullanıcılar listesi çekilemedi:", err);
      }
    } finally {
      setUsersLoading(false);
    }
  }, [authUser]);

  // ✅ TAKİP ET
  const followUser = async (targetId) => {
    try {
      await API.put(`/users/follow/${targetId}`);

      const currentUserId = authUser?.user?._id;

      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === targetId
            ? {
                ...u,
                followers: [...(u.followers || []), currentUserId],
              }
            : u,
        ),
      );

      if (authUser?.user) {
        const updatedFollowing = [...(authUser.user.following || []), targetId];
        updateUser({ following: updatedFollowing });
      }

      return { success: true };
    } catch (err) {
      console.error("Takip hatası:", err);
      return { success: false };
    }
  };

  // ❌ TAKİBİ BIRAK
  const unfollowUser = async (targetId) => {
    try {
      await API.put(`/users/unfollow/${targetId}`);

      const currentUserId = authUser?.user?._id;

      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === targetId
            ? {
                ...u,
                followers: (u.followers || []).filter(
                  (id) => id !== currentUserId,
                ),
              }
            : u,
        ),
      );

      if (authUser?.user) {
        const updatedFollowing = (authUser.user.following || []).filter(
          (id) => id !== targetId,
        );
        updateUser({ following: updatedFollowing });
      }

      return { success: true };
    } catch (err) {
      console.error("Takibi bırakma hatası:", err);
      return { success: false };
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <UserContext.Provider
      value={{
        allUsers,
        usersLoading,
        fetchAllUsers,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
