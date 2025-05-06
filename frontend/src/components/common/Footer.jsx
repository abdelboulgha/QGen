import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="copyright">
        &copy; {new Date().getFullYear()} Générateur de Quiz Interactifs - Tous droits réservés
      </div>
    </footer>
  );
};

export default Footer;