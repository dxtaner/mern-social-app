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

export const UserProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const fetchAllUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await API.get("/users/all");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Kullanıcılar listesi çekilemedi:", err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const followUser = async (targetId) => {
    try {
      await API.put(`/users/follow/${targetId}`);
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === targetId
            ? { ...u, followers: [...u.followers, currentUser.user._id] }
            : u,
        ),
      );
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  const unfollowUser = async (targetId) => {
    try {
      await API.put(`/users/unfollow/${targetId}`);
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === targetId
            ? {
                ...u,
                followers: u.followers.filter(
                  (id) => id !== currentUser.user._id,
                ),
              }
            : u,
        ),
      );
      return { success: true };
    } catch (err) {
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

export const useUsers = () => useContext(UserContext);
