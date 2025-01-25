import React, { useState, useEffect, useRef } from "react";
import Spiner from "../Spiner";
import Styles from "../../Styles/InputBox.module.css";
import PageHeader from "../Content/PageHeader";

const DashboardInputbox = () => {
  const [url, setUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [showDownloadContainer, setShowDownloadContainer] = useState(false);
  const [isDownloadButtonDisabled, setIsDownloadButtonDisabled] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => {
        setInputError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [inputError]);

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + ":" : ""}${minutes}:${remainingSeconds}s`;
  }

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleDownload = async () => {
    if (!url) {
      setInputError(true);
      return;
    }
    
    setInputError(false);
    setLoading(true);
    setError(""); // Reset error state
    setIsDownloadButtonDisabled(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MP3}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setDownloadLink(data.downloadLink);
        setVideoDetails(data.videoDetails);
        setShowDownloadContainer(true);
      } else {
        setError(data.error || "Failed to fetch download link");
      }
    } catch (error) {
      setError("Error downloading video: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadButtonClick = () => {
    if (downloadLink) {
      const tempAnchor = document.createElement("a");
      tempAnchor.href = downloadLink;
      tempAnchor.setAttribute("download", "audio.mp3");
      tempAnchor.click();
      tempAnchor.remove();
    } else {
      setError("Download link is not available");
    }
  };

  const handlePasteClick = async () => {
    if (isPasteOpen) {
      setIsPasteOpen(false);
    } else {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text);
        setIsPasteOpen(true);
      } catch (err) {
        setError("Failed to read clipboard contents");
      }
    }
  };

  const handleClearClick = () => {
    setUrl("");
    if (isPasteOpen) {
      setIsPasteOpen(false);
      inputRef.current.focus();
    }
  };

  return (
    <>
      <PageHeader />
      {!videoDetails && (
        <form
          id="search-form"
          className={Styles.searchForm}
          action="/"
          method="GET"
        >
          <div className={Styles.inputGroup}>
            <input
              ref={inputRef}
              id="s_input"
              type="text"
              aria-required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={Styles.formControl}
              aria-label="Search"
              placeholder="Paste URL Youtube"
            />
            <div className={Styles.inputGroupBtn}>
              <span
                className={Styles.paste}
                id="paste"
                onClick={handlePasteClick}
              >
                <span>
                  <i className={Styles.iconBtn}></i>
                  {isPasteOpen ? "Clear" : "Paste"}
                </span>
              </span>
              {url && (
                <span
                  className={Styles.paste}
                  id="clear"
                  onClick={handleClearClick}
                >
                  <span>
                    <i className={Styles.iconBtn}></i>
                    Clear
                  </span>
                </span>
              )}
              <button
                className={Styles.BtnBtnDefault}
                onClick={handleDownload}
                type="button"
                disabled={isDownloadButtonDisabled}
              >
                Download
              </button>
            </div>
          </div>
        </form>
      )}
      {inputError && (
        <p className={Styles.error}>Please enter a valid YouTube URL.</p>
      )}
      {error && <p className={Styles.error}>{error}</p>}
      <div style={{ textAlign: "center" }}>
        {loading && <Spiner />}
        {loading &&
          !videoDetails &&
          "Retrieving data, please wait a few seconds!"}
      </div>
      {!loading && videoDetails && (
        <div
          className={`${Styles.downloadContainer} ${
            showDownloadContainer ? Styles.show : ""
          }`}
        >
          <div className={Styles.details}>
            <img src={videoDetails.thumbnail} alt="Thumbnail" />
            <div className={Styles.info}>
              <h4>{videoDetails.title}</h4>
              <p>{formatDuration(videoDetails.duration)}</p>
              <button
                className={Styles.downloadButton}
                onClick={handleDownloadButtonClick}
              >
                Download mp3
              </button>
              <button
                className={Styles.refreshButton}
                onClick={handleRefreshPage}
              >
                Download other video
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardInputbox;
