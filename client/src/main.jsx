import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfileProvider } from "./context/ProfileContext";
import { UserProvider } from "./context/UserContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
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
  </AuthProvider>,
);
