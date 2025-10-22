import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateLogin } from "../../utils/validation";
import api from '../../services/apiInterceptor';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Use interceptor for login API
      const res = await api.post(`Auth/login`, {
        userName: formData.username,
        password: formData.password,
      });

      toast.success("Login Successful!");
      console.log("Response:", res.data);

      // 🔹 Save token in localStorage
      localStorage.setItem("token", res.data.token);

      // 🔹 Set token for future API calls
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      // 🔹 Persist login state
      localStorage.setItem("isLoggedIn", "true");
      onLogin();

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error("Login Failed! " + errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #3f87a6, #ebf8e1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="shadow-lg p-5"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">🔐 Login to ERP</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control form-control-lg ${errors.username ? "is-invalid" : ""}`}
              value={formData.username}
              onChange={handleChange}
              autoFocus
              disabled={loading}
              placeholder="Enter your username"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
