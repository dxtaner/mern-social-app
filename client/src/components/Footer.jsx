import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* BRAND SECTION */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            Social<span>App</span>
          </h2>
          <p className="footer-slogan">
            Dünyayla bağlantıda kal, anılarını paylaş.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://github.com/dxtaner" aria-label="Github">
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/tanerozer16/"
              aria-label="Linkedin"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* LINKS SECTION */}
        <div className="footer-links">
          <div className="link-group">
            <h4>Platform</h4>
            <Link to="/">Ana Sayfa</Link>
            <Link to="#">Keşfet</Link>
            <Link to="#">Trendler</Link>
          </div>

          <div className="link-group">
            <h4>Destek</h4>
            <Link to="#">Yardım Merkezi</Link>
            <Link to="#">Gizlilik Politikası</Link>
            <Link to="#">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <hr />
        <p>© {currentYear} SocialApp • Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
