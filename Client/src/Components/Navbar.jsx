/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from '../Styles/Navbar.module.css';
import Logo from '../assets/logo.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle(Styles.navbarExpanded, !isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove(Styles.navbarExpanded);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={Styles.navbar}>
      <div className={Styles.navbarBrand}>
    <a href="/">
      <img src={Logo} alt="Logo"style={{ width: '30px', height: 'auto' }} />
    </a>
      </div>
      <button className={Styles.navbarToggle} onClick={toggleMenu}>
        {isOpen ? '✖' : '☰'}
      </button>
      <div className={`${Styles.navbarMenu} ${isOpen ? Styles.isActive : ''}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => { closeMenu(); document.title = "Download YouTube videos in 1080p, 2k, 4k | Youtube Downloader"; scrollToTop(); }}>
              Youtube Downloader
            </Link>
          </li>
          <li>
            <Link to="/Mp3" onClick={() => { closeMenu(); document.title = "Youtube To mp3 in the highest quality"; scrollToTop(); }}>
              Youtube to MP3
            </Link>
          </li>
          <li>
            <Link to="/Mp4" onClick={() => { closeMenu(); document.title = "Youtube To mp4 Download and convert Youtube videos to mp4 in 1080p, 2k, 4k"; scrollToTop(); }}>
              Youtube to MP4
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
