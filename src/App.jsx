import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// 🔹 Auth & Layout
import Login from "./pages/auth/Login";
import Header from "./layouts/Header";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import { AppProvider } from "./context/AppContext";
//import AppContent from "./AppContent";

// 🔹 Modules
import Designation from "./modules/security/pages/Designation";
import DesignationView from "./modules/security/components/Designation/DesignationView";
import DesignationSibling from "./modules/security/pages/DesignationSibling";
import DesignationSiblingView from "./modules/security/components/DesignationSibling/DesignationSiblingView";
import Department from "./modules/security/pages/Department";
import DepartmentView from "./modules/security/components/Department/DepartmentView";
import Education from "./modules/security/pages/Education";
import EducationView from "./modules/security/components/Education/EducationView";
import Default from "./modules/security/pages/Default";

//import Document from "./modules/document/pages/Document";

// 🔹 Other Apps (Add your apps here)
import ComplaintApp from "./modules/security/pages/Designation"; // ✅ Added Complaint App
import DocumentApp from "./modules/document/pages/Document"; // ✅ Added Document App

// 🔹 Toasts & Styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./layouts/custom.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 🔹 PrimeReact
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// 🔹 AppContent Component (Main logic)
function AppContent() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    // 🔹 Clear all login data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");

    // 🔹 Remove Authorization header
    import("axios").then(({ default: axios }) => {
      delete axios.defaults.headers.common["Authorization"];
    });

    // 🔹 Update login state
    setIsLoggedIn(false);

    // 🔹 Redirect to login & replace history (no back navigation)
    navigate("/", { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      {isLoggedIn && <Navbar />}

      <main className="flex-grow-1 container mt-4">
        <Routes>
          {/* 🔹 Public (Login) */}
          {!isLoggedIn && <Route path="/" element={<Login onLogin={handleLogin} />} />}

          {/* 🔹 Private Routes */}
          {isLoggedIn && (
            <>
               <Route path="/" element={<Navigate to="/default" replace />} /> 

              {/* ✅ FIXED: Redirect root to document */}
              {/* <Route path="/" element={<Navigate to="/document" replace />} /> */}

              {/* ✅ ADDED: Document Routes */}
              {/* <Route path="/document" element={<Document />} /> */}

              {/* Department */}
              <Route path="/department" element={<Department />} />
              <Route path="/department/view/:id" element={<DepartmentView />} />

              {/* Designation */}
              <Route path="/designation" element={<Designation />} />
              <Route path="/designation/view/:id" element={<DesignationView />} />

              {/* Designation Sibling */}
              <Route path="/designationsibling" element={<DesignationSibling />} />
              <Route path="/designationsibling/view/:id" element={<DesignationSiblingView />} />

              {/* Education */}
              <Route path="/education" element={<Education />} />
              <Route path="/education/view/:id" element={<EducationView />} />

              {/* Default Security Dashboard */}
              <Route path="/default" element={<Default />} />

              {/* ✅ Other Apps - Complaint App Added */}
              <Route path="/complaint/*" element={<ComplaintApp />} />

              {/* ✅ Other Apps - Document App Added */}
              <Route path="/document/*" element={<DocumentApp />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/default" replace />} />
            </>
          )}

          {/* 🔹 Protect direct access when not logged in */}
          {!isLoggedIn && (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </main>

      {isLoggedIn && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// 🔹 Root Wrapper
export default function App() {
  return (
    // <Router>
    //   <AppContent />
    // </Router>
    // <AppProvider>
    //   <Router>
    //     <AppContent />
    //   </Router>
    // </AppProvider>
    <Router> {/* ✅ Pehle Router */}
      <AppProvider> {/* ✅ Phir AppProvider (Router ke andar) */}
        <AppContent />
      </AppProvider>
    </Router>
  );
}