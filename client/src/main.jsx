import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfileProvider } from "./context/ProfileContext";
import { UserProvider } from "./context/UserContext";
import "./index.css";

// 🔐 Auth hazır olmadan diğer provider'ları başlatma
const AppProviders = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // istersen spinner yap
  }

  return (
    <UserProvider>
      <PostProvider>
        <CommentProvider>
          <NotificationProvider>
            <ProfileProvider>
              <App />
            </ProfileProvider>
          </NotificationProvider>
        </CommentProvider>
      </PostProvider>
    </UserProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProviders />
    </AuthProvider>
  </React.StrictMode>,
);
