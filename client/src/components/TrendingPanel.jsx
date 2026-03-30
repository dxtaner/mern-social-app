import { useEffect, useMemo } from "react";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./trendingPanel.css";

const TRENDING_TOPICS = [
  { tag: "#react", posts: "12.4K gönderi", category: "Yazılım" },
  { tag: "#nodejs", posts: "8.1K gönderi", category: "Gündem" },
  { tag: "#mern", posts: "5.2K gönderi", category: "Teknoloji" },
  { tag: "#javascript", posts: "20K gönderi", category: "Yazılım" },
];

const TrendingPanel = () => {
  const { allUsers, usersLoading, fetchAllUsers, followUser, unfollowUser } =
    useUsers();
  const { user: currentUser } = useAuth();
  const BASE_URL = "http://localhost:8800";

  useEffect(() => {
    if (allUsers.length === 0) fetchAllUsers();
  }, [fetchAllUsers, allUsers.length]);

  const suggestions = useMemo(() => {
    return allUsers
      ?.filter((u) => u._id !== currentUser?.user?._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allUsers, currentUser?.user?._id]);

  const isFollowing = (user) =>
    user.followers?.includes(currentUser?.user?._id);

  const handleFollowToggle = async (user) => {
    isFollowing(user)
      ? await unfollowUser(user._id)
      : await followUser(user._id);
  };

  return (
    <aside className="trending-panel">
      <div className="panel-section card-glass">
        <h3 className="section-title">Neler Oluyor?</h3>
        <div className="trends-container">
          {TRENDING_TOPICS.map((item, index) => (
            <div key={index} className="trend-row">
              <span className="trend-category">{item.category}</span>
              <span className="trend-tag">{item.tag}</span>
              <span className="trend-count">{item.posts}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section card-glass">
        <h3 className="section-title">Kimi Takip Etmeli</h3>

        {usersLoading ? (
          <div className="mini-loader"></div>
        ) : (
          <div className="suggestions-container">
            {suggestions.map((user) => {
              const profilePic =
                user.profilePic && user.profilePic.startsWith("http")
                  ? user.profilePic
                  : `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;

              const following = isFollowing(user);

              return (
                <div key={user._id} className="suggested-user-row">
                  <Link to={`/profile/${user._id}`} className="suggested-meta">
                    <img src={profilePic} alt="" className="mini-avatar" />
                    <div className="suggested-names">
                      <span className="display-name">
                        {user.username.split("@")[0]}
                      </span>
                      <span className="username-tag">
                        @{user.username.toLowerCase()}
                      </span>
                    </div>
                  </Link>
                  <button
                    className={`mini-follow-btn ${following ? "active" : ""}`}
                    onClick={() => handleFollowToggle(user)}
                  >
                    {following ? "Bırak" : "Takip"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default TrendingPanel;
