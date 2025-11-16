import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/apiInterceptor";
import { useApp } from "../context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../layouts/custom.css";

export default function Navbar() {
  const [menus, setMenus] = useState([]);
  const [userRole, setUserRole] = useState(1);
  const location = useLocation();
  //const navigate = useNavigate();useNavigate
  const { currentApp, changeApp } = useApp();

  // ✅ Get user role once on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(parseInt(storedRole));
    }
  }, []);

  // ✅ Optimized app detection with path mapping
  const detectAndChangeApp = useCallback(() => {
    const path = location.pathname;
    
    const appRoutes = {
      '/document': { id: 13, name: 'Document' },
      '/complaint': { id: 2, name: 'Complaint' },
      '/security': { id: 1, name: 'Security' },
      '/default': { id: 1, name: 'Security' },
      '/': { id: 1, name: 'Security' }
    };

    const matchedRoute = Object.keys(appRoutes).find(route => 
      path.includes(route) || path === route
    );

    if (matchedRoute && currentApp.id !== appRoutes[matchedRoute].id) {
      changeApp(appRoutes[matchedRoute].id, appRoutes[matchedRoute].name);
    }
  }, [location.pathname, currentApp.id, changeApp]);

  // ✅ Single optimized useEffect for app detection and menu fetching
  useEffect(() => {
    detectAndChangeApp();
    
    const fetchMenus = async () => {
      if (!currentApp.id || !userRole) return;
      
      try {
        const res = await api.get(
          `ApplicationMenu/GetAll?applicationId=${currentApp.id}&roleId=${userRole}`
        );
        setMenus(res.data.menus || []);
      } catch (error) {
        console.error("❌ Failed to load menus:", error);
        setMenus([]);
      }
    };

    fetchMenus();
  }, [currentApp.id, userRole, detectAndChangeApp]); // ✅ Only these dependencies

  // ✅ Manual app change function
  // const handleAppChange = (appId, appName, route = null) => {
  //   changeApp(appId, appName);
  //   if (route) {
  //     navigate(route);
  //   }
  // };

  // 🔹 Recursive render for nested dropdowns
  const renderMenu = (menu, isSubmenu = false) => {
    const hasChildren = menu.children && menu.children.length > 0;

    const route =
      menu.url && menu.url !== "#"
        ? `/${menu.url
            .replace(/\.(aspx|jsx|js|html)$/gi, "")
            .replace(/\s+/g, "")
            .trim()
            .toLowerCase()}`
        : "#";

    const isActive = location.pathname === route;

    if (hasChildren) {
      return (
        <li
          key={menu.id}
          className={`nav-item dropdown ${isSubmenu ? "dropdown-submenu" : ""}`}
        >
          <a
            href="#"
            className={`${isSubmenu ? "dropdown-item dropdown-toggle" : "nav-link dropdown-toggle"}`}
            id={`dropdown-${menu.id}`}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {menu.name}
          </a>
          <ul className="dropdown-menu" aria-labelledby={`dropdown-${menu.id}`}>
            {menu.children.map((child) => renderMenu(child, true))}
          </ul>
        </li>
      );
    }

    return (
      <li key={menu.id}>
        <Link
          to={route}
          className={`dropdown-item ${isActive ? "active" : ""}`}
        >
          {menu.name}
        </Link>
      </li>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom sticky-top"
    >
      <div className="container-fluid px-3">
        {/* 🔹 Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔹 Menu items */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* Left-aligned menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            {menus.map((menu) => renderMenu(menu))}
          </ul>
        </div>
      </div>
    </nav>
  );
}