import { useEffect } from "react";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import "./trendingPanel.css";

const TrendingPanel = () => {
  const { allUsers, usersLoading, fetchAllUsers, followUser, unfollowUser } =
    useUsers();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const suggestions = allUsers
    ?.filter((u) => u._id !== currentUser?.user?._id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  const trendingTopics = [
    { tag: "#react", posts: "12.4K gönderi" },
    { tag: "#nodejs", posts: "8.1K gönderi" },
    { tag: "#mern", posts: "5.2K gönderi" },
    { tag: "#javascript", posts: "20K gönderi" },
  ];

  const isFollowing = (user) => {
    return user.followers?.includes(currentUser?.user?._id);
  };

  const handleFollowToggle = async (user) => {
    if (isFollowing(user)) {
      await unfollowUser(user._id);
    } else {
      await followUser(user._id);
    }
  };

  const BASE_URL = "http://localhost:8800";

  return (
    <div className="trending-panel">
      <div className="panel-card trending-card">
        <h3>🔥 Trending</h3>
        {trendingTopics.map((item, index) => (
          <div key={index} className="trend-item">
            <span className="trend-tag">{item.tag}</span>
            <span className="trend-count">{item.posts}</span>
          </div>
        ))}
      </div>

      <div className="panel-card suggestions-card">
        <h3>👥 Kimleri takip etmeliyim?</h3>

        {usersLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          suggestions.map((user) => {
            const profilePic = user.profilePic
              ? `${BASE_URL}/images/${user.profilePic}`
              : `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;

            return (
              <div key={user._id} className="suggestion-item">
                <img
                  src={profilePic}
                  alt={user.username}
                  className="suggestion-avatar"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;
                  }}
                />

                <div className="user-info">
                  <span className="name">{user.username.split("@")[0]}</span>
                  <span className="username">
                    @{user.username.split("@")[0]}
                  </span>
                </div>

                <button
                  className={`follow-btn ${isFollowing(user) ? "following" : ""}`}
                  onClick={() => handleFollowToggle(user)}
                >
                  {isFollowing(user) ? "Takibi Bırak" : "Takip Et"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrendingPanel;
