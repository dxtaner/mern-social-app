import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import { useState, useEffect } from "react";
import "./navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { allUsers } = useUsers();
  const { notifications, markAsRead } = useNotification();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const BASE_URL = "http://localhost:8800";
  const currentUser = user?.user;

  const profilePic =
    currentUser?.profilePic && currentUser.profilePic.startsWith("http")
      ? currentUser.profilePic
      : `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username || "unknown_user"}`;

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredUsers([]);
      return;
    }
    const results = allUsers.filter((u) =>
      u.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
    setFilteredUsers(results);
    setActiveIndex(-1);
  }, [debouncedSearch, allUsers]);

  const handleSelectUser = (id) => {
    setSearch("");
    setFilteredUsers([]);
    setMobileMenuOpen(false);
    navigate(`/profile/${id}`);
  };

  const handleKeyDown = (e) => {
    if (!filteredUsers.length) return;
    if (e.key === "ArrowDown")
      setActiveIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : 0,
      );
    if (e.key === "ArrowUp")
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredUsers.length - 1,
      );
    if (e.key === "Enter" && activeIndex >= 0)
      handleSelectUser(filteredUsers[activeIndex]._id);
  };

  const renderNotificationText = (n) => {
    const sender = allUsers.find((u) => u._id === n.senderId);
    const senderName = sender ? sender.username : "Biri";

    switch (n.type) {
      case "like":
        return `${senderName} gönderini beğendi ❤️`;
      case "comment":
        return `${senderName} gönderine yorum yaptı 💬`;
      case "follow":
        return `${senderName} seni takip etmeye başladı 👤`;
      default:
        return `${senderName} yeni bir bildirim gönderdi 🔔`;
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    setShowNotifications(false);
    setMobileMenuOpen(false);

    if (n.type === "follow") navigate(`/profile/${n.senderId}`);
    else if (n.postId) navigate(`/post/${n.postId}`);
    else navigate(`/profile/${n.senderId}`);
  };

  const groupedNotifications = notifications.reduce((acc, n) => {
    if (!acc[n.type]) acc[n.type] = [];
    acc[n.type].push(n);
    return acc;
  }, {});

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Social<span>App</span>
        </Link>
      </div>

      <div className="navbar-hamburger">
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <div className={`navbar-right ${mobileMenuOpen ? "open" : ""}`}>
        <div className="search-box">
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {search.trim() !== "" && (
            <div className="search-dropdown">
              {filteredUsers.length === 0 && (
                <div className="search-item no-result">
                  Kullanıcı bulunamadı
                </div>
              )}
              {filteredUsers.map((u, index) => {
                const pic = u.profilePic
                  ? `${BASE_URL}/images/${u.profilePic}`
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`;
                return (
                  <div
                    key={u._id}
                    className={`search-item ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => handleSelectUser(u._id)}
                  >
                    <img src={pic} alt={u.username} className="search-avatar" />
                    <span>{u.username}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link to="/" className="icon-btn">
          🏠
        </Link>

        <div className="notification-wrapper">
          <button
            className="icon-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            🔔
            {notifications.some((n) => !n.isRead) && (
              <span className="notification-badge" />
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0 && (
                <div className="notification-item">Bildirim yok</div>
              )}
              {Object.entries(groupedNotifications).map(([type, items]) => (
                <div key={type} className="notification-group">
                  <div className="notification-group-title">
                    {type.toUpperCase()} ({items.length})
                  </div>
                  {items.map((n) => (
                    <div
                      key={n._id}
                      className={`notification-item ${
                        n.isRead ? "read" : "unread"
                      }`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {renderNotificationText(n)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-menu">
          <Link to={`/profile/${currentUser?._id}`} className="profile-link">
            <img src={profilePic} alt="profile" className="avatar" />
            <span className="username">{currentUser?.username}</span>
          </Link>
          <button className="logout-btn" onClick={logout}>
            Çıkış
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
