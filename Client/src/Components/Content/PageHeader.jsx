/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Styles from '../../Styles/PageHeader.module.css';

const PageHeader = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/Mp3":
        setPageTitle("Download MP3 from Youtube");
        setPageDescription(
          "Convert Youtube videos to mp3 in the highest quality"
        );
        break;
      case "/Mp4":
        setPageTitle("Download MP4 from Youtube");
        setPageDescription(
          "Download and convert Youtube videos to MP4 in 1080p, 2k, 4k"
        );
        break;
      default:
        setPageTitle("Best Youtube Video Downloader");
        setPageDescription("Download Youtube videos in HD, 1080p, 2k, 4k");
        break;
    }
  }, [location.pathname]);

  return (
    <div className={Styles.title}>
      <h2 className={Styles.pageTitle}>{pageTitle}</h2>
      <p className={Styles.pageDescription}>{pageDescription}</p>
    </div>
  );
};

export default PageHeader;
