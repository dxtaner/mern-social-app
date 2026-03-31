import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await API.post("/auth/login", credentials);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Giriş başarısız",
      };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const register = async (userData) => {
    try {
      await API.post("/auth/register", userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Kayıt başarısız",
      };
    }
  };

  const updateUser = useCallback((newData) => {
    setUser((prev) => {
      if (!prev) return null;

      const updatedUser = {
        ...prev,
        user: { ...prev.user, ...newData },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
