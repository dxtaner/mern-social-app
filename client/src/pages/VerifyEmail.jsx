import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./auth.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setMessage(res.data.message);
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.message || "Geçersiz link");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === "loading" && <h2>Doğrulanıyor...</h2>}
        {status === "success" && (
          <>
            <h2>✅ {message}</h2>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Login'e git
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <h2>❌ {message}</h2>
            <button className="auth-btn" onClick={() => navigate("/register")}>
              Register ol
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
