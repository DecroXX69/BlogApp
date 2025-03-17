// frontend/src/components/layout/Footer.js
import React from 'react';
import styles from '../../styles/modules/Footer.module.css';

const Footer = () => {
  return (
    <footer className={`py-3 mt-4 bg-dark text-white ${styles.footer}`}>
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} Rushikesh's GOD Tier Blogs. All rights reserved to Rushikesh only.</p>
      </div>
    </footer>
  );
};

export default Footer;