module.exports = {
    apps: [
      {
        name: 'Youtube-MP3-MP4-Downloader',
        script: 'index.js', // Replace with the name of your server file
        watch: true,
        autorestart: true,
        max_restarts: 100,
        restart_delay: 1000, // delay between restarts
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  