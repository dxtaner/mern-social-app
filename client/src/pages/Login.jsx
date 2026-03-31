import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if (result.success) navigate("/");
    else alert(result.message);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Hesabın yok mu?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
