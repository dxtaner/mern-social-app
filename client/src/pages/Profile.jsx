import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import Navbar from "../components/Navbar";
import "./profile.css";

const Profile = () => {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const { profile, fetchProfile, updateProfile, loading } = useProfile();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [previews, setPreviews] = useState({ profile: null, cover: null });

  const BASE_URL = "http://localhost:8800";
  const isOwner = authUser?.user?._id === id;

  useEffect(() => {
    fetchProfile(id);
  }, [id, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "profile") {
        setProfilePic(file);
        setPreviews((prev) => ({ ...prev, profile: url }));
      } else {
        setCoverPic(file);
        setPreviews((prev) => ({ ...prev, cover: url }));
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    const result = await updateProfile(id, formData);
    if (result.success) {
      alert("Profil güncellendi! ✨");
      setPreviews({ profile: null, cover: null });
    }
  };

  if (loading) return <div className="loader-center">Yükleniyor...</div>;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        {/* Üst Header Kartı */}
        <div className="glass-card profile-header-card">
          <div className="cover-wrapper">
            <img
              className="cover-img-full"
              src={
                previews.cover ||
                (profile?.coverPic
                  ? `${BASE_URL}/images/${profile.coverPic}`
                  : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070")
              }
              alt="cover"
            />
            {isOwner && (
              <label className="glass-edit-btn cover-btn">
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "cover")}
                />
                Kapağı Güncelle
              </label>
            )}
          </div>

          <div className="profile-identity">
            <div className="avatar-container">
              <img
                className="main-avatar"
                src={
                  previews.profile ||
                  (profile?.profilePic
                    ? `${BASE_URL}/images/${profile.profilePic}`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`)
                }
                alt="avatar"
              />
              {isOwner && (
                <label className="avatar-change-overlay">
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(e, "profile")}
                  />
                  <span>Düzenle</span>
                </label>
              )}
            </div>

            <div className="identity-text">
              <h1>{profile?.username}</h1>
              <p className="user-email">@{profile?.username.toLowerCase()}</p>

              <div className="mini-stats">
                <div className="mini-stat">
                  <b>{profile?.followers?.length || 0}</b> Takipçi
                </div>
                <div className="mini-stat">
                  <b>{profile?.following?.length || 0}</b> Takip
                </div>
              </div>
            </div>

            <div className="identity-actions">
              {!isOwner ? (
                <button className="follow-btn-primary">Takip Et</button>
              ) : (
                <button className="settings-btn-outline">⚙️ Ayarlar</button>
              )}
            </div>
          </div>
        </div>

        {/* Alt Düzenleme Paneli */}
        {isOwner && (
          <div className="glass-card settings-card">
            <div className="card-header">
              <h2>Profil Düzenleme</h2>
              <p>Hesap bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </div>

            <form onSubmit={handleUpdate} className="settings-grid-form">
              <div className="input-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Adınız..."
                />
              </div>

              <div className="input-group">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="glass-submit-btn">
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
