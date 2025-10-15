import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth & Layout
import Login from "./pages/auth/Login";
import Header from "./layouts/Header";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Designation from "./modules/security/pages/Designation";
import DesignationView from "./modules/security/components/Designation/DesignationView";
//  import DesignationSibling from "./modules/security/pages/DesignationSibling";
//  import DesignationSiblingView from "./modules/security/components/DesignationSibling/DesignationSiblingView";



// Toasts & Styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// PrimeReact
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
     <Router>
       <div className="d-flex flex-column min-vh-100">
         {isLoggedIn && <Header onLogout={handleLogout} />}
         {isLoggedIn && <Navbar />}

        <main className="flex-grow-1 container mt-4">
           <Routes>
             {!isLoggedIn ? (
               <Route path="/" element={<Login onLogin={handleLogin} />} />
             ) : (
               <>

                {/* <Route path="/" element={<Navigate to="/departments" replace />} /> */}
                <Route path="/designations" element={<Designation />} />
                <Route path="/designations/view/:id" element={<DesignationView />} />
                <Route path="*" element={<Navigate to="/designations" replace />} />
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
