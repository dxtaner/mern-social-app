import { useEffect } from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import UsersSidebar from "../components/UsersSidebar";
import TrendingPanel from "../components/TrendingPanel";
import "./home.css";

const Home = () => {
  const { user } = useAuth();
  const { posts, loading, fetchAllPosts } = usePosts();

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const username = user?.user?.username?.split("@")[0] || "Misafir";

  return (
    <div className="app">
      <Navbar />

      <div className="home-container">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar-section">
          <UsersSidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-section">
          <div className="welcome-card">
            <h1>
              Hoş geldin, <span>{username}</span> 👋
            </h1>
            <p>Bugün neler oluyor keşfet 🚀</p>
          </div>

          <div className="create-card">
            <CreatePost />
          </div>

          <div className="feed">
            {loading ? (
              <div className="loader-box">Yükleniyor...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="post-wrapper">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="empty-state">Henüz gönderi yok ✨</div>
            )}
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="right-section">
          <TrendingPanel />
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Social App • Made with ❤️</p>
      </footer>
    </div>
  );
};

export default Home;
