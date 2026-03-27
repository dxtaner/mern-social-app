import { useEffect, useState } from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useComments } from "../context/CommentContext";
import { Link } from "react-router-dom";
import "./postcard.css";

const PostCard = ({ post }) => {
  const { likePost, deletePost } = usePosts();
  const { user: currentUser } = useAuth();
  const { allUsers } = useUsers();
  const { comments, fetchComments, addComment, deleteComment } = useComments();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const BASE_URL = "http://localhost:8800";
  const postOwner = allUsers.find((u) => u._id === post.userId);
  const postComments = comments[post._id] || [];
  const isLiked = post.likes?.includes(currentUser?.user._id);

  useEffect(() => {
    if (showComments) fetchComments(post._id);
  }, [showComments, post._id, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await addComment(post._id, newComment);
    if (res.success) setNewComment("");
  };

  const displayName = postOwner?.username.split("@")[0] || "Kullanıcı";
  const profilePic = postOwner?.profilePic
    ? `${BASE_URL}/images/${postOwner.profilePic}`
    : `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}`;

  return (
    <div className="post-card">
      {/* HEADER */}
      <header className="post-header">
        <Link to={`/profile/${postOwner?._id}`} className="post-user">
          <img src={profilePic} alt={displayName} className="post-avatar" />
          <div className="post-user-info">
            <span className="post-name">{displayName}</span>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </Link>
        {currentUser?.user._id === post.userId && (
          <button
            className="post-delete"
            onClick={() => deletePost(post._id)}
            title="Sil"
          >
            ✕
          </button>
        )}
      </header>

      {/* BODY */}
      <div className="post-body">
        {post.desc && <p className="post-desc">{post.desc}</p>}
        {post.img && (
          <div
            className="post-image-container"
            onDoubleClick={() => likePost(post._id)}
          >
            <img
              src={
                post.img.startsWith("http")
                  ? post.img
                  : `${BASE_URL}/images/${post.img}`
              }
              alt="post"
              className="post-image"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="post-footer">
        <div className="post-actions">
          <button
            className={`action-btn ${isLiked ? "liked" : ""}`}
            onClick={() => likePost(post._id)}
          >
            {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
          </button>

          <button
            className="action-btn"
            onClick={() => setShowComments(!showComments)}
          >
            💬 {postComments.length}
          </button>
        </div>

        {/* COMMENTS */}
        {showComments && (
          <div className="comments-section">
            <div className="comments-list">
              {postComments.map((c) => {
                const cUser = allUsers.find((u) => u._id === c.userId);
                const cName = cUser?.username.split("@")[0] || "Kullanıcı";
                const cPic = cUser?.profilePic
                  ? `${BASE_URL}/images/${cUser.profilePic}`
                  : `https://api.dicebear.com/7.x/notionists/svg?seed=${cName}`;
                return (
                  <div key={c._id} className="comment-item">
                    <img src={cPic} alt={cName} className="comment-avatar" />
                    <div className="comment-content">
                      <span className="comment-author">{cName}</span>
                      <span className="comment-text">{c.desc}</span>
                    </div>
                    {currentUser?.user._id === c.userId && (
                      <button
                        className="comment-delete"
                        onClick={() => deleteComment(c._id, post._id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Yorum yaz..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" disabled={!newComment.trim()}>
                Paylaş
              </button>
            </form>
          </div>
        )}
      </footer>
    </div>
  );
};

export default PostCard;
