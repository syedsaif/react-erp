import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_security.png";

export default function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Show "Back to Security" if not already in a security route
  const isOutsideSecurity = !location.pathname.startsWith("/security");

  return (
    <header className="bg-light py-3 border-bottom shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          style={{ height: "100px" }}
        />

        {/* Buttons */}
        <div className="d-flex flex-column align-items-end gap-2">
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={onLogout}
          >
            <span className="fs-5">🚪</span>
            <span>Logout</span>
          </button>

          {/* Show Back to Security button if outside the module */}
          {isOutsideSecurity && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/roles")} // Temporary route
            >
              🔙 Back to Security
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
