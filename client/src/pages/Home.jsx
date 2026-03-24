import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="home">
        <div className="home-container">
          <div className="welcome-card">
            <h2>Hoşgeldin {user?.user.username} 👋</h2>
            <p>Postlar burada görünecek</p>
          </div>

          {/* Örnek post */}
          <div className="post-card">
            <div className="post-user">Taner</div>
            <div className="post-content">İlk postum 🚀</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
