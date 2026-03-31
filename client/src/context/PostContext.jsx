import { createContext, useContext, useState, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user: authUser } = useAuth();

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/posts/all");
      setPosts(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.error("Posts could not be loaded", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostById = (id) => posts.find((p) => p._id === id);

  const likePost = async (postId) => {
    if (!authUser) {
      alert("Beğenmek için önce giriş yapmalısın! 🔒");
      return;
    }
    try {
      const res = await API.put(`/posts/like/${postId}`);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post)),
      );
    } catch (err) {
      console.error("Like error details:", err.response?.data || err.message);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Bu gönderiyi silmek istediğinden emin misin?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchAllPosts,
        likePost,
        deletePost,
        getPostById,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
