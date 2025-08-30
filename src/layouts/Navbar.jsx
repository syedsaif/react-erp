import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          {/* 📁 DMS */}
        </Link>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="configDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                App Configuration
              </span>
              <ul className="dropdown-menu" aria-labelledby="configDropdown">
                {/* Changed Roles link to go to /roles/new */}
                <li><Link className="dropdown-item" to="/roles">Roles</Link></li>
                <li><Link className="dropdown-item" to="/users">Users</Link></li>
                <li><Link className="dropdown-item" to="/user-role">User Role</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="adminDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                App Administration
              </span>
              <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                <li><Link className="dropdown-item" to="/letter-types">Letter Types</Link></li>
                <li><Link className="dropdown-item" to="/departments">Departments</Link></li>
                <li><Link className="dropdown-item" to="/designations">Designations</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="reportsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Reports
              </span>
              <ul className="dropdown-menu" aria-labelledby="reportsDropdown">
                <li><Link className="dropdown-item" to="/reports/letters">Letters Report</Link></li>
                <li><Link className="dropdown-item" to="/reports/user-activity">User Activity</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
