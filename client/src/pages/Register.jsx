import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (result.success) navigate("/login");
    else alert(result.message);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account 🚀</h1>
        <p>Join and start your journey</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

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
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Zaten hesabın var mı?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
