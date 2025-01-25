/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Footer.module.css';

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
          if (window.pageYOffset > 300) {
              setShowScrollButton(true);
          } else {
              setShowScrollButton(false);
          }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <ul className={`${styles.flex} ${styles['flex-a-i-center']}`}>
          <li className={styles.name}>
            <p>&copy;{new Date().getFullYear()} Yt downloader</p>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
          <li>
            <Link to="/">Terms of Service</Link>
          </li>
          <li>
            <Link to="/">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/">Contact</Link>
          </li>
        </ul>
      </div>
      <div>
      {showScrollButton && (
            <button onClick={scrollToTop} className={styles.scrollToTop}>
                ⬆️
            </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
