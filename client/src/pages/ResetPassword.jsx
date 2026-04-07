import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch {
      alert("Hata oluştu");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        {success ? (
          <>
            <p>✅ Şifre güncellendi</p>
            <button onClick={() => navigate("/login")}>Login'e git</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button>Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
