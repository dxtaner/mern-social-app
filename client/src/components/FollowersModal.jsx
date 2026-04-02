import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import "./followersModal.css";

const FollowersModal = ({ isOpen, onClose, users = [], title }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { allUsers, followUser, unfollowUser, fetchAllUsers } = useUsers();

  const [visibleCount, setVisibleCount] = useState(5);

  if (!isOpen) return null;

  const currentUser = allUsers.find((u) => u._id === authUser?.user?._id);

  const isFollowing = (targetId) => currentUser?.following?.includes(targetId);

  const userList = users
    .map((id) => allUsers.find((u) => u._id === id))
    .filter(Boolean)
    .slice(0, visibleCount);

  const handleFollow = async (id) => {
    try {
      if (isFollowing(id)) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }
      await fetchAllUsers();
    } catch (err) {
      console.error("Follow/Unfollow hatası:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          {userList.length > 0 ? (
            userList.map((user) => (
              <div key={user._id} className="modal-user">
                <div
                  className="modal-user-left"
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    onClose();
                  }}
                >
                  <img
                    src={
                      user?.profilePic && user.profilePic.startsWith("http")
                        ? user.profilePic
                        : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || "unknown_user"}`
                    }
                    alt="avatar"
                  />
                  <p className="username">{user.username}</p>
                </div>

                {authUser?.user?._id !== user._id && (
                  <button
                    className={`follow-btn ${
                      isFollowing(user._id) ? "following" : ""
                    }`}
                    onClick={() => handleFollow(user._id)}
                  >
                    {isFollowing(user._id) ? "Takibi Bırak" : "Takip Et"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="empty">Henüz takipçi yok.</p>
          )}

          {visibleCount < users.length && (
            <button
              className="load-more"
              onClick={() => setVisibleCount((prev) => prev + 5)}
            >
              Daha Fazla Göster
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
