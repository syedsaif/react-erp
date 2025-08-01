import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
import UserRoleAssociation from "./pages/UserRoleAssociation";
import LetterManagement from "./pages/LetterManagement";
import LetterForm from "./components/letter/LetterForm";
import ViewLetter from "./components/letter/ViewLetter";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Required for collapse


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}

      <div className="container mt-4">
        <Routes>
          {!isLoggedIn ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/user-role" element={<UserRoleAssociation />} />
              <Route path="/letters" element={<LetterManagement />} />
              <Route path="/letters/new" element={<LetterForm />} />
              <Route path="/letters/view/:id" element={<ViewLetter />} />
              <Route path="*" element={<Navigate to="/roles" />} />
            </>
          )}
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;