import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Import all app logos
import securityLogo from "../assets/images/logo_security.png";
import complaintLogo from "../assets/images/logo_complaint.png";
import requisitionLogo from "../assets/images/logo_requisition.png";
import vehicleLogo from "../assets/images/logo_vehicle.png";
import fundsLogo from "../assets/images/logo_fund.png";
import distributionLogo from "../assets/images/logo_distribution.png";
import trainingLogo from "../assets/images/logo_training.png";
import misLogo from "../assets/images/logo_management.png";
import documentsLogo from "../assets/images/logo_document.png";

export default function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Hardcoded username - aap baad mein dynamic kar lena
  const username = "Super Admin";

  // ✅ Get current app logo based on URL path
  const getCurrentAppLogo = () => {
    const path = location.pathname;
    
    if (path.includes("/designation") || path.includes("/cms")) {
      return complaintLogo;
    } else if (path.includes("/requisition") || path.includes("/rms")) {
      return requisitionLogo;
    } else if (path.includes("/vehicle") || path.includes("/vms")) {
      return vehicleLogo;
    } else if (path.includes("/funds") || path.includes("/fms")) {
      return fundsLogo;
    } else if (path.includes("/distribution") || path.includes("/dms")) {
      return distributionLogo;
    } else if (path.includes("/training") || path.includes("/tms")) {
      return trainingLogo;
    } else if (path.includes("/mis")) {
      return misLogo;
    } else if (path.includes("/document") || path.includes("/doc")) {
      return documentsLogo;
    }else {
      return securityLogo; // Default security logo
    }
  };

  // ✅ Check if we're outside security app
  const isOutsideSecurity = !location.pathname.startsWith("/security") && 
                           location.pathname !== "/" && 
                           !location.pathname.includes("/Default");

  // ✅ Format date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // ✅ Navigate back to security default page
  const handleBackToSecurity = () => {
    navigate("/Default"); // Security app ka default page
  };

  return (
    <header className="bg-light py-3 border-bottom shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        {/* ✅ Dynamic App Logo */}
        <img
          src={getCurrentAppLogo()}
          alt="App Logo"
          style={{ height: "100px" }}
          className="rounded"
        />

        {/* ✅ User Info, Date & Time, Logout */}
        <div className="d-flex flex-column align-items-end gap-2">
          
          {/* User Info and Date Time */}
          <div className="text-end">
            {/* ✅ Username */}
            <div className="fw-bold text-dark fs-6">
              👤 {username}
            </div>
            
            {/* ✅ Date and Time */}
            <div className="text-muted small">
              <span className="me-2">📅 {formattedDate}</span>
              <br className="d-sm-none" />
              <span>⏰ {formattedTime}</span>
            </div>
          </div>

          {/* ✅ Buttons */}
          <div className="d-flex gap-2">
            {/* Show Back to Security button only when outside security app */}
            {isOutsideSecurity && (
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                onClick={handleBackToSecurity}
              >
                <span>🔙</span>
                <span>Back to Security</span>
              </button>
            )}

            <button
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={onLogout}
            >
              <span className="fs-5">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}