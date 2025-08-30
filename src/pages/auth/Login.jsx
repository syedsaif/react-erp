import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateLogin } from "../../utils/validation"; // correct path adjust karen

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Hardcoded check, aap apne logic ke hisab se replace kar sakte hain
      if (formData.username === "admin" && formData.password === "admin") {
        toast.success("Login successful!");
        onLogin();
      } else {
        toast.error("Invalid credentials!");
      }
    } else {
      toast.error("Please fix the errors before submitting.");
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
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}



