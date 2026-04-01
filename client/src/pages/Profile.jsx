import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { usePosts } from "../context/PostContext";
import { useUsers } from "../context/UserContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Footer from "../components/Footer";
import FollowersModal from "../components/FollowersModal";
import "./profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { profile, fetchProfile, updateProfile, loading } = useProfile();
  const { posts, fetchAllPosts } = usePosts();
  const { allUsers, followUser, unfollowUser } = useUsers();

  const [activeTab, setActiveTab] = useState("posts");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [previews, setPreviews] = useState({ profile: null, cover: null });

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const BASE_URL = "http://localhost:8800";
  const isOwner = authUser?.user?._id === id;

  useEffect(() => {
    fetchProfile(id);
    fetchAllPosts();
  }, [id, fetchProfile, fetchAllPosts]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setEmail(profile.email || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setBirthDate(profile.birthDate ? profile.birthDate.split("T")[0] : "");
    }
  }, [profile]);

  const userPosts = useMemo(
    () => posts.filter((p) => p.userId === id),
    [posts, id],
  );

  const likedPosts = useMemo(
    () => posts.filter((p) => p.likes?.includes(id)),
    [posts, id],
  );

  const targetUser = allUsers.find((u) => u._id === id);
  const isFollowing = targetUser?.followers?.includes(authUser?.user?._id);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "profile") {
      setProfilePic(file);
      setPreviews((prev) => ({ ...prev, profile: url }));
    } else {
      setCoverPic(file);
      setPreviews((prev) => ({ ...prev, cover: url }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("birthDate", birthDate);
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    const result = await updateProfile(id, formData);

    if (result.success) {
      alert("Profil başarıyla güncellendi! ✨");
      setPreviews({ profile: null, cover: null });
      setProfilePic(null);
      setCoverPic(null);
      setActiveTab("posts");
    }
  };

  if (loading) return <div className="loader-center">Yükleniyor...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">
        <div className="elite-card profile-header-card">
          <div className="cover-container">
            <img
              className="cover-image"
              src={
                previews.cover ||
                (profile?.coverPic?.startsWith("http")
                  ? profile.coverPic
                  : profile?.coverPic
                    ? `${BASE_URL}/images/${profile.coverPic}`
                    : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400")
              }
              alt="cover"
            />
            {isOwner && activeTab === "settings" && (
              <>
                <input
                  type="file"
                  id="coverInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, "cover")}
                />
                <label htmlFor="coverInput" className="cover-edit-overlay">
                  📷 Kapağı Değiştir
                </label>
              </>
            )}
          </div>

          <div className="profile-content-top">
            <div className="avatar-wrapper">
              <img
                className="profile-avatar"
                src={
                  previews.profile ||
                  (profile?.profilePic?.startsWith("http")
                    ? profile.profilePic
                    : profile?.profilePic
                      ? `${BASE_URL}/images/${profile.profilePic}`
                      : `https://api.dicebear.com/7.x/notionists/svg?seed=${username}`)
                }
                alt="avatar"
              />
              {isOwner && activeTab === "settings" && (
                <>
                  <input
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "profile")}
                  />
                  <label htmlFor="profileInput" className="avatar-edit-overlay">
                    Değiştir
                  </label>
                </>
              )}
            </div>

            <div className="profile-info-text">
              <div className="name-row">
                <div className="user-titles">
                  <h1>{profile?.username}</h1>
                  <p className="handle">@{profile?.username?.toLowerCase()}</p>
                  {profile?.bio && (
                    <p className="profile-bio-text">{profile.bio}</p>
                  )}
                  {profile?.location && (
                    <p className="profile-location-text">
                      📍 {profile.location}
                    </p>
                  )}
                  {profile?.birthDate && (
                    <p className="profile-birthdate">
                      🎂 {new Date(profile.birthDate).toLocaleDateString()}
                    </p>
                  )}
                  {targetUser?.lastLogin && (
                    <p className="profile-lastlogin">
                      🟢 Son giriş:{" "}
                      {new Date(targetUser.lastLogin).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="actions-cell">
                  {!isOwner ? (
                    <button
                      className={`btn-primary ${isFollowing ? "following" : ""}`}
                      onClick={() =>
                        isFollowing ? unfollowUser(id) : followUser(id)
                      }
                    >
                      {isFollowing ? "Takibi Bırak" : "Takip Et"}
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        setActiveTab(
                          activeTab === "settings" ? "posts" : "settings",
                        )
                      }
                    >
                      {activeTab === "settings" ? "🏠 Dön" : "Profil Düzenle"}
                    </button>
                  )}
                </div>
              </div>

              <div className="profile-stats">
                <span>
                  <b>{userPosts.length}</b> Gönderi
                </span>
                <span
                  onClick={() => setShowFollowers(true)}
                  style={{ cursor: "pointer" }}
                >
                  <b>{targetUser?.followers?.length || 0}</b> Takipçi
                </span>
                <span
                  onClick={() => setShowFollowing(true)}
                  style={{ cursor: "pointer" }}
                >
                  <b>{targetUser?.following?.length || 0}</b> Takip
                </span>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              className={activeTab === "posts" ? "active" : ""}
              onClick={() => setActiveTab("posts")}
            >
              Gönderiler
            </button>
            <button
              className={activeTab === "likes" ? "active" : ""}
              onClick={() => setActiveTab("likes")}
            >
              Beğeniler
            </button>
            {isOwner && (
              <button
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                Ayarlar
              </button>
            )}
          </div>
        </div>

        <div className="profile-dynamic-content">
          {activeTab === "settings" && isOwner ? (
            <div className="elite-card settings-panel animate-in">
              <h2>Profil Ayarları</h2>
              <form onSubmit={handleUpdate} className="elite-form">
                <div className="input-row">
                  <div className="input-field">
                    <label>Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Şehir / Konum</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>E-posta</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Doğum Tarihi</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Biyografi</label>
                  <textarea
                    value={bio}
                    maxLength="150"
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <button type="submit" className="save-btn">
                  Değişiklikleri Kaydet
                </button>
              </form>
            </div>
          ) : (
            <div className="posts-feed animate-in">
              {(activeTab === "posts" ? userPosts : likedPosts).length > 0 ? (
                (activeTab === "posts" ? userPosts : likedPosts).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <div className="empty-state">
                  Burada henüz bir şey yok... ✨
                </div>
              )}
            </div>
          )}
        </div>

        {/* Followers / Following Modals */}
        <FollowersModal
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
          users={targetUser?.followers || []}
          title="Takipçiler"
        />
        <FollowersModal
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
          users={targetUser?.following || []}
          title="Takip Edilenler"
        />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
