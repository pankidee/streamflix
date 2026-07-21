const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function convertToHLS(inputPath, movieId) {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '..', '..', 'uploads', 'processed', String(movieId));
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPlaylist = path.join(outputDir, 'playlist.m3u8');

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-codec:', 'copy',
      '-start_number', '0',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-f', 'hls',
      outputPlaylist,
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(outputDir);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

module.exports = { convertToHLS };