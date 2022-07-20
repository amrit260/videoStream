const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/video', function (req, res) {
  const range = req.headers.range;

  const videoPath = 'C:/Users/Amrit/Downloads/moonknight6.mp4';
  // res.sendFile(videoPath);
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 500 ** 6; // 5MB
  console.log(range);
  const start = Number(range.replace(/\D/g, ''));
  if (!range) {
    res.status(400).send('Requires Range header');
  }
  console.log('video size = ' + videoSize);
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = videoSize - 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

app.listen(8000, function () {
  console.log('Listening on port 8000!');
});
