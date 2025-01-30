import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MedIQ. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
