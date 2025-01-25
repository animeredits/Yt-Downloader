const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const bodyParser = require("body-parser");
const youtubedl = require("youtube-dl-exec");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const Domain = process.env.Domain || `http://localhost:${PORT}`;

app.use(bodyParser.json());
app.use(cors());

// Helper functions
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9\s.-]/g, "").replace(/\s+/g, "_");
}

const downloadThumbnail = async (url, outputPath) => {
  const response = await axios({ url, responseType: "stream" });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", resolve)
      .on("error", reject);
  });
};

// Endpoint for MP3 downloads
app.post("/download", async (req, res) => {
  const { url } = req.body;

  try {
    const videoInfo = await youtubedl(url, { dumpSingleJson: true });
    const videoTitle = sanitizeFilename(videoInfo.title);
    const thumbnailURL = videoInfo.thumbnail;

    const filename = `${videoTitle}.mp3`;
    const filepath = path.join(__dirname, "downloads", filename);

    await new Promise((resolve, reject) => {
      youtubedl(url, {
        extractAudio: true,
        audioFormat: "mp3",
        output: filepath,
      })
        .then(resolve)
        .catch(reject);
    });

    res.json({
      downloadLink: `${Domain}/download/${filename}`,
      videoDetails: {
        title: videoInfo.title,
        thumbnail: thumbnailURL,
        duration: videoInfo.duration,
      },
    });
  } catch (error) {
    console.error("Error downloading MP3:", error);
    res.status(500).json({ error: "Failed to download MP3" });
  }
});

// Endpoint for MP4 downloads
app.post("/download-mp4", async (req, res) => {
  const { url } = req.body;

  try {
    const videoInfo = await youtubedl(url, { dumpSingleJson: true });
    const videoTitle = sanitizeFilename(videoInfo.title);
    const thumbnailURL = videoInfo.thumbnail;

    const videoFilename = `${videoTitle}_${uuidv4()}.mp4`;
    const videoPath = path.join(__dirname, "downloads", videoFilename);

    const thumbnailFilename = `${videoTitle}_${uuidv4()}.jpg`;
    const thumbnailPath = path.join(__dirname, "downloads", thumbnailFilename);

    // Download video
    await new Promise((resolve, reject) => {
      youtubedl(url, {
        format: "bestvideo+bestaudio",
        output: videoPath,
        mergeOutputFormat: "mp4",
      })
        .then(resolve)
        .catch(reject);
    });

    // Download thumbnail
    await downloadThumbnail(thumbnailURL, thumbnailPath);

    // Send response
    res.json({
      downloadLink: `${Domain}/download/${videoFilename}`,
      videoDetails: {
        title: videoInfo.title,
        thumbnail: thumbnailURL,
        duration: videoInfo.duration,
      },
    });
  } catch (error) {
    console.error("Error downloading MP4:", error);
    res.status(500).json({ error: "Failed to download MP4" });
  }
});

// Endpoint to handle file downloads (Stream to the default download folder)
app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  
  // Instead of serving from the server folder, we stream it directly
  const fileUrl = path.join(__dirname, "downloads", filename);

  res.download(fileUrl, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      if (!res.headersSent) {
        res.status(404).json({ error: "File not found" });
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🟢`);
});
