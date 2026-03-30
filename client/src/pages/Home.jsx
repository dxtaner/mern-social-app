import { useEffect, useState } from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import UsersSidebar from "../components/UsersSidebar";
import TrendingPanel from "../components/TrendingPanel";
import Footer from "../components/Footer";
import "./home.css";

const POSTS_PER_PAGE = 5;

const Home = () => {
  const { user } = useAuth();
  const { posts, loading, fetchAllPosts } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const username = user?.user?.username?.split("@")[0] || "Misafir";

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="app">
      <Navbar />

      <div className="home-container">
        <aside className="sidebar-section">
          <UsersSidebar />
        </aside>

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
            ) : currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <div key={post._id} className="post-wrapper">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="empty-state">Henüz gönderi yok ✨</div>
            )}
          </div>

          {posts.length > POSTS_PER_PAGE && (
            <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                ← Önceki
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Sonraki →
              </button>
            </div>
          )}
        </main>

        <aside className="right-section">
          <TrendingPanel />
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
