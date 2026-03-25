import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const BASE_URL = "http://localhost:8800";

  const profilePic = user?.user?.profilePic
    ? `${BASE_URL}/images/${user.user.profilePic}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.user?.username}`;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            Social<span>App</span>
          </Link>
        </div>

        {/* Orta: Arama Çubuğu (Opsiyonel ama şık durur) */}

        <div className="nav-center">
          <div className="search-bar">
            <span className="search-icon">🔍</span>

            <input type="text" placeholder="Arkadaşlarını ara..." />
          </div>
        </div>

        {/* Sağ: Linkler ve Profil */}

        <div className="nav-right">
          <div className="nav-icons">
            <Link title="Ana Sayfa" to="/" className="nav-link-icon">
              🏠
            </Link>

            {/* <div title="Bildirimler" className="nav-link-icon">

              🔔<span className="badge">3</span>

            </div> */}
          </div>

          <div className="nav-user">
            <Link to={`/profile/${user?.user?._id}`} className="nav-user-info">
              <img src={profilePic} alt="me" className="nav-avatar" />

              <span className="nav-username">{user?.user?.username}</span>
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
