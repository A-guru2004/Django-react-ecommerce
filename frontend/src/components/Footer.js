import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white-50 text-center py-3 mt-auto">
      <div className="container">
        <small>&copy; {new Date().getFullYear()} E-Shop Full-Stack Application. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;