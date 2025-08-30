import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth & Layout
import Login from "./pages//auth/Login";
import Header from "./layouts/Header";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

import Role from "./modules/security/pages/Role";
import RoleForm from "./modules/security/components/role/RoleForm";
import RoleView from "./modules/security/components/role/RoleView";

// Toasts & Styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

//Primeng datatable
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or any theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Show header and navbar only if logged in */}
        {isLoggedIn && <Header onLogout={handleLogout} />}
        {isLoggedIn && <Navbar />}

        <main className="flex-grow-1 container mt-4">
          <Routes>
            {!isLoggedIn ? (
              // Redirect to login if not logged in
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            ) : (
              <>                
                {/* Roles - handled internally in RoleManagement */}
                <Route path="/roles" element={<Role />} />
                <Route path="/roles/new" element={<RoleForm />} />
                <Route path="/roles/view/:id" element={<RoleView />} />
                

                {/* Catch-all redirect to letters */}
                <Route path="*" element={<Navigate to="/roles" />} />
              </>
            )}
          </Routes>
        </main>

        {isLoggedIn && <Footer />}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
