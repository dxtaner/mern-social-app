import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(form);
    setLoading(false);

    if (res.success) navigate("/");
    else alert(res.message);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
          />

          <div className="password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>

          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
