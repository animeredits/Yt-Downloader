const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const ytdlp = require("yt-dlp-exec");

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

// Endpoint for MP3 downloads
app.post("/download", async (req, res) => {
  const { url } = req.body;

  try {
    const videoInfo = await ytdlp(url, {
      dumpSingleJson: true,
    });

    const videoTitle = sanitizeFilename(videoInfo.title);
    const filename = `${videoTitle}.mp3`;
    const filepath = path.join(__dirname, "downloads", filename);

    // Use yt-dlp to extract audio
    await new Promise((resolve, reject) => {
      ytdlp(url, {
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
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
      },
    });
  } catch (error) {
    console.error("Error downloading MP3:", error);
    res.status(500).json({ error: "Failed to download MP3" });
  }
});

app.post("/download-mp4", async (req, res) => {
  const { url } = req.body;

  try {
    // Get video details
    const videoInfo = await ytdlp(url, { dumpSingleJson: true });
    const videoTitle = sanitizeFilename(videoInfo.title);
    const filename = `${videoTitle}.mp4`;
    const filepath = path.join(__dirname, "downloads", filename);

    // Download MP4
    await ytdlp(url, {
      format: "bestvideo+bestaudio/best",
      output: filepath,
    });

    res.json({
      downloadLink: `${req.protocol}://${req.get("host")}/download/${filename}`,
      videoDetails: {
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
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
