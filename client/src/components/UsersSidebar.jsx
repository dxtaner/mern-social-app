import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { FaUserPlus, FaUserCheck } from "react-icons/fa"; // İkonlar
import "./usersSidebar.css";

const UsersSidebar = () => {
  const { allUsers, followUser, unfollowUser, usersLoading } = useUsers();
  const { user: currentUser } = useAuth();
  const BASE_URL = "http://localhost:8800";

  const suggestions = useMemo(() => {
    if (!allUsers) return [];
    return allUsers
      .filter((u) => u._id !== currentUser?.user?._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, [allUsers, currentUser?.user?._id]);

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

  if (usersLoading) return <div className="sidebar-loading">Yükleniyor...</div>;

  return (
    <div className="users-sidebar-container">
      <div className="sidebar-header">
        <h3>Kimi Takip Etmeli</h3>
      </div>

      <div className="suggestions-list">
        {suggestions.map((user) => {
          const profilePic =
            user.profilePic && user.profilePic.startsWith("http")
              ? user.profilePic
              : `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;

          const following = isFollowing(user);

          return (
            <div key={user._id} className="suggestion-item">
              <Link to={`/profile/${user._id}`} className="user-info-link">
                <img src={profilePic} alt="" className="user-avatar-md" />
                <div className="user-details">
                  <span className="display-name">
                    {user.username.split("@")[0]}
                  </span>
                  <span className="username-tag">
                    @{user.username.toLowerCase()}
                  </span>
                </div>
              </Link>

              <button
                className={`follow-action-btn ${following ? "is-following" : ""}`}
                onClick={() => handleFollowToggle(user)}
              >
                {following ? <FaUserCheck /> : <FaUserPlus />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersSidebar;
