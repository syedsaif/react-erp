import React from "react";

export default function Footer() {
  return (
    <footer className="bg-light text-muted text-center py-3 mt-auto">
      <div className="container">
        &copy; {new Date().getFullYear()} Security Management System. All rights reserved.
      </div>
    </footer>
  );
}
