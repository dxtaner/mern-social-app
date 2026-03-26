import { Link } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import "./usersSidebar.css";

const UsersSidebar = () => {
  const { allUsers, followUser, unfollowUser } = useUsers();
  const { user: currentUser } = useAuth();

  const BASE_URL = "http://localhost:8800";

  const suggestions = allUsers
    ?.filter((u) => u._id !== currentUser?.user?._id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const isFollowing = (user) => {
    return user.followers?.includes(currentUser?.user?._id);
  };

  const handleFollowToggle = (user) => {
    if (isFollowing(user)) {
      unfollowUser(user._id);
    } else {
      followUser(user._id);
    }
  };

  return (
    <div className="users-sidebar">
      <h3>👥 Kullanıcılar</h3>

      {suggestions.map((user) => {
        const profilePic = user.profilePic
          ? `${BASE_URL}/images/${user.profilePic}`
          : `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;

        return (
          <div key={user._id} className="sidebar-user">
            <Link to={`/profile/${user._id}`} className="user-left">
              <img
                src={profilePic}
                alt={user.username}
                className="user-avatar"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`;
                }}
              />
              <span className="user-name">{user.username.split("@")[0]}</span>
            </Link>

            <button
              className={`follow-btn ${isFollowing(user) ? "following" : ""}`}
              onClick={() => handleFollowToggle(user)}
            >
              {isFollowing(user) ? "Takibi Bırak" : "Takip Et"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default UsersSidebar;
