import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Logos
import securityLogo from '../assets/images/logo_security.png';
import complaintLogo from '../assets/images/logo_complaint.png';
import requisitionLogo from '../assets/images/logo_requisition.png';
import vehicleLogo from '../assets/images/logo_vehicle.png';
import fundsLogo from '../assets/images/logo_fund.png';
import distributionLogo from '../assets/images/logo_distribution.png';
import trainingLogo from '../assets/images/logo_training.png';
import misLogo from '../assets/images/logo_management.png';
import documentsLogo from '../assets/images/logo_document.png';

export default function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState('Guest');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update username from localStorage
  const updateUserData = () => {
    const fullName = localStorage.getItem('userFullName');
    if (fullName && fullName !== 'undefined' && fullName !== 'null') {
      setUsername(fullName);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.UserFullName || 'User');
    } else {
      setUsername('Guest');
    }
  };

  useEffect(() => {
    updateUserData();
    window.addEventListener('storage', updateUserData);
    return () => window.removeEventListener('storage', updateUserData);
  }, []);

  // App logo mapping
  const getCurrentAppLogo = () => {
    const path = location.pathname;
    if (path.includes('/designation') || path.includes('/cms')) return complaintLogo;
    if (path.includes('/requisition') || path.includes('/rms')) return requisitionLogo;
    if (path.includes('/vehicle') || path.includes('/vms')) return vehicleLogo;
    if (path.includes('/funds') || path.includes('/fms')) return fundsLogo;
    if (path.includes('/distribution') || path.includes('/dms')) return distributionLogo;
    if (path.includes('/training') || path.includes('/tms')) return trainingLogo;
    if (path.includes('/mis')) return misLogo;
    if (path.includes('/document') || path.includes('/doc')) return documentsLogo;
    return securityLogo;
  };

  // App colors
  const appColors = {
    complaint: { primary: '#6d4c41', secondary: '#8d6e63' },
    requisition: { primary: '#00695c', secondary: '#00897b' },
    vehicle: { primary: '#5e35b1', secondary: '#7e57c2' },
    funds: { primary: '#283593', secondary: '#3949ab' },
    distribution: { primary: '#d84315', secondary: '#f4511e' },
    training: { primary: '#00838f', secondary: '#0097a7' },
    mis: { primary: '#455a64', secondary: '#546e7a' },
    document: { primary: '#0d47a1', secondary: '#1976d2' },
    security: { primary: '#1c3d5a', secondary: '#3c6e99' },
  };

  const getCurrentAppColors = () => {
    const path = location.pathname;
    if (path.includes('/designation') || path.includes('/cms')) return appColors.complaint;
    if (path.includes('/requisition') || path.includes('/rms')) return appColors.requisition;
    if (path.includes('/vehicle') || path.includes('/vms')) return appColors.vehicle;
    if (path.includes('/funds') || path.includes('/fms')) return appColors.funds;
    if (path.includes('/distribution') || path.includes('/dms')) return appColors.distribution;
    if (path.includes('/training') || path.includes('/tms')) return appColors.training;
    if (path.includes('/mis')) return appColors.mis;
    if (path.includes('/document') || path.includes('/doc')) return appColors.document;
    return appColors.security;
  };

  const isOutsideSecurity =
    !location.pathname.startsWith('/security') &&
    location.pathname !== '/' &&
    !location.pathname.includes('/Default');

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleBackToSecurity = () => navigate('/Default');

  return (
    <header
      className="py-3 shadow-sm"
      style={{
        background: `linear-gradient(to right, ${getCurrentAppColors().primary}, ${getCurrentAppColors().secondary})`,
        borderBottom: `3px solid ${getCurrentAppColors().secondary}`,
      }}
    >
      <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
        {/* App Logo */}
        <img src={getCurrentAppLogo()} alt="App Logo" style={{ height: '100px' }} className="rounded" />

        {/* User Info */}
        <div className="d-flex flex-column align-items-end gap-2">
          <div className="text-end">
            <div className="fw-bold text-white fs-6">👤 {username}</div>
            <div className="small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span className="me-2">📅 {formattedDate}</span>
              <br className="d-sm-none" />
              <span>⏰ {formattedTime}</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            {isOutsideSecurity && (
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={handleBackToSecurity}
              >
                🔙 Back to Security
              </button>
            )}

            <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
