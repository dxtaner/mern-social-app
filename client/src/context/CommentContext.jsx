import { createContext, useContext, useState, useCallback } from "react";
import API from "../services/api";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (postId) => {
    setLoading(true);
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Yorumlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = async (postId, desc) => {
    try {
      const res = await API.post("/comments", {
        postId: postId,
        desc: desc,
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [res.data, ...(prev[postId] || [])],
      }));

      return { success: true };
    } catch (err) {
      console.error(
        "Yorum ekleme hatası detay:",
        err.response?.data || err.message,
      );
      return { success: false };
    }
  };
  const deleteComment = async (commentId, postId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("Yorum silme hatası:", err);
    }
  };

  return (
    <CommentContext.Provider
      value={{ comments, loading, fetchComments, addComment, deleteComment }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => useContext(CommentContext);
