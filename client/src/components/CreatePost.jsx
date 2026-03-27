import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import API from "../services/api";
import "./createPost.css";

const CreatePost = () => {
  const { user } = useAuth();
  const { fetchAllPosts } = usePosts();
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc && !file) return;

    setLoading(true);
    const newPost = new FormData();
    newPost.append("desc", desc);
    if (file) {
      newPost.append("img", file);
    }

    try {
      await API.post("/posts", newPost);
      setDesc("");
      setFile(null);
      setPreview(null);
      fetchAllPosts();
    } catch (err) {
      console.error("Post paylaşma hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.user?.username?.split("@")[0] || "Kullanıcı";
  const avatarSrc = user?.user?.profilePic
    ? `http://localhost:8800/images/${user.user.profilePic}`
    : `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}`;

  return (
    <div className="share-card">
      <form onSubmit={handleSubmit}>
        <div className="share-top">
          <img src={avatarSrc} alt="avatar" className="share-avatar" />
          <textarea
            placeholder={`Neler düşünüyorsun, ${displayName}?`}
            className="share-input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {preview && (
          <div className="share-preview-wrapper">
            <img className="share-preview-img" src={preview} alt="preview" />
            <button
              type="button"
              className="preview-close"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="share-divider" />

        <div className="share-bottom">
          <div className="share-options">
            <label htmlFor="file" className="share-option">
              <span className="share-option-icon">🖼️</span>
              <span className="share-option-text">Fotoğraf</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <button
            className="share-submit-btn"
            type="submit"
            disabled={(!desc && !file) || loading}
          >
            {loading ? "Paylaşılıyor..." : "Paylaş"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
