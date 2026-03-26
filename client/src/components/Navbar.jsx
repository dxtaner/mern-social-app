import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useState, useEffect } from "react";
import "./navbar.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { allUsers } = useUsers();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const BASE_URL = "http://localhost:8800";

  const currentUser = user?.user;

  const profilePic = currentUser?.profilePic
    ? `${BASE_URL}/images/${currentUser.profilePic}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`;

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredUsers([]);
      return;
    }

    setLoading(true);

    const results = allUsers.filter((u) =>
      u.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    setFilteredUsers(results);
    setLoading(false);
    setActiveIndex(-1);
  }, [debouncedSearch, allUsers]);

  const handleSelectUser = (id) => {
    setSearch("");
    setFilteredUsers([]);
    navigate(`/profile/${id}`);
  };

  const handleKeyDown = (e) => {
    if (!filteredUsers.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : 0,
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredUsers.length - 1,
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelectUser(filteredUsers[activeIndex]._id);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            Social<span>App</span>
          </Link>
        </div>

        {/* CENTER */}
        <div className="navbar-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {search.trim() !== "" && (
              <div className="search-dropdown">
                {loading && <div className="search-item">Yükleniyor...</div>}

                {!loading && filteredUsers.length === 0 && (
                  <div className="search-item no-result">
                    Kullanıcı bulunamadı
                  </div>
                )}

                {!loading &&
                  filteredUsers.map((u, index) => {
                    const profilePic = u.profilePic
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
                        <img
                          src={profilePic}
                          alt={u.username}
                          className="search-avatar"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`;
                          }}
                        />
                        <span>{u.username}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">
          <Link to="/" className="icon-btn">
            🏠
          </Link>

          <div className="profile-menu">
            <Link to={`/profile/${currentUser?._id}`} className="profile-link">
              <img src={profilePic} alt="profile" className="avatar" />
              <span className="username">{currentUser?.username}</span>
            </Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
