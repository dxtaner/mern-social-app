import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useComments } from "../context/CommentContext";
import Navbar from "../components/Navbar";
import UsersSidebar from "../components/UsersSidebar";
import TrendingPanel from "../components/TrendingPanel";
import Footer from "../components/Footer";
import "./postDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { posts, fetchAllPosts, likePost, deletePost, getPostById } =
    usePosts();
  const { user: currentUser } = useAuth();
  const { allUsers } = useUsers();
  const { comments, fetchComments, addComment, deleteComment } = useComments();

  const [newComment, setNewComment] = useState("");

  const BASE_URL = "http://localhost:8800";

  const post = getPostById(id);

  useEffect(() => {
    if (!posts.length) fetchAllPosts();
  }, []);

  useEffect(() => {
    if (id) fetchComments(id);
  }, [id]);

  if (!post) return <div className="pd-loading">Yükleniyor...</div>;

  const owner = allUsers.find((u) => u._id === post.userId);
  const postComments = comments[post._id] || [];
  const isLiked = post.likes?.includes(currentUser?.user._id);

  const username = owner?.username?.split("@")[0] || "Kullanıcı";

  // Gönderi sahibi profili
  const avatar =
    owner?.profilePic && owner.profilePic.startsWith("http")
      ? owner.profilePic
      : `https://api.dicebear.com/7.x/notionists/svg?seed=${username || "unknown_user"}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await addComment(post._id, newComment);
    if (res.success) setNewComment("");
  };

  return (
    <>
      <Navbar />
      <div className="pd-wrapper">
        <div className="pd-grid">
          {/* LEFT SIDEBAR */}
          <div className="pd-left">
            <UsersSidebar />
          </div>

          {/* CENTER CONTENT */}
          <div className="pd-center">
            <div className="pd-header">
              <button onClick={() => navigate(-1)}>←</button>
              <h3>Gönderi</h3>
            </div>

            <div className="pd-card">
              {/* POST OWNER */}
              <Link to={`/profile/${owner?._id}`} className="pd-user">
                <img src={avatar} alt={username} />
                <div>
                  <span className="pd-name">{username}</span>
                  <span className="pd-time">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>

              {/* POST CONTENT */}
              {post.desc && <p className="pd-text">{post.desc}</p>}
              {post.img && (
                <img
                  src={
                    post.img.startsWith("http")
                      ? post.img
                      : `${BASE_URL}/images/${post.img}`
                  }
                  alt="Post"
                  className="pd-img"
                  onDoubleClick={() => likePost(post._id)}
                />
              )}

              {/* ACTIONS */}
              <div className="pd-actions">
                <button
                  className={`pd-like ${isLiked ? "active" : ""}`}
                  onClick={() => likePost(post._id)}
                >
                  {isLiked ? "❤️" : "🤍"} {post.likes?.length}
                </button>
                <span>💬 {postComments.length}</span>
                {currentUser?.user._id === post.userId && (
                  <button
                    className="pd-delete"
                    onClick={() => deletePost(post._id)}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>

            {/* COMMENT FORM */}
            <form className="pd-comment-form" onSubmit={handleSubmit}>
              <input
                placeholder="Yorum yaz..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button disabled={!newComment.trim()}>Gönder</button>
            </form>

            {/* COMMENTS LIST */}
            <div className="pd-comments">
              {postComments.map((c) => {
                const u = allUsers.find((x) => x._id === c.userId);
                const name = u?.username?.split("@")[0] || "Kullanıcı";
                // Kullanıcı profili
                const pic =
                  u?.profilePic && u.profilePic.startsWith("http")
                    ? u.profilePic
                    : `https://api.dicebear.com/7.x/notionists/svg?seed=${name || "unknown_user"}`;

                return (
                  <div key={c._id} className="pd-comment">
                    <img src={pic} alt={name} />
                    <div className="pd-comment-box">
                      <span className="pd-comment-name">{name}</span>
                      <p>{c.desc}</p>
                    </div>
                    {currentUser?.user._id === c.userId && (
                      <button onClick={() => deleteComment(c._id, post._id)}>
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="pd-right">
            <TrendingPanel />
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default PostDetails;
