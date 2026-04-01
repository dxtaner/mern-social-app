import { createContext, useContext, useState, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth();

  const fetchProfile = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Profil çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (id, formData) => {
    try {
      const res = await API.put(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);

      updateUser({
        profilePic: res.data.profilePic,
        username: res.data.username,
      });

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Profil güncellenemedi",
      };
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loading, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
