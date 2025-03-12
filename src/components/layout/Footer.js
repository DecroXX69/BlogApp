// frontend/src/components/layout/Footer.js
import React from 'react';
import styles from '../../styles/modules/Footer.module.css';

const Footer = () => {
  return (
    <footer className={`py-3 mt-4 bg-dark text-white ${styles.footer}`}>
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} MERN Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;