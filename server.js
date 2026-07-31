const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;
const defaultUploadDir = path.join(process.cwd(), 'uploads');
const UPLOAD_DIR = process.argv[2] ? path.resolve(process.argv[2]) : defaultUploadDir;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Get available files
app.get('/api/files', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const fileInfos = files.map(file => {
      const stats = fs.statSync(path.join(UPLOAD_DIR, file));
      return {
        name: file,
        size: stats.size,
        mtime: stats.mtime
      };
    }).sort((a, b) => b.mtime - a.mtime);
    
    res.json(fileInfos);
  });
});

// Download a file
app.get('/api/download/:filename', (req, res) => {
  const filepath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filepath)) {
    res.download(filepath, req.params.filename, { dotfiles: 'allow' });
  } else {
    res.status(404).send('File not found');
  }
});

// Delete a file
app.delete('/api/files/:filename', (req, res) => {
  const filepath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.status(200).send('Deleted');
  } else {
    res.status(404).send('File not found');
  }
});

// Upload a file (raw stream for max speed)
app.post('/api/upload', (req, res) => {
  const filename = req.headers['x-file-name'];
  if (!filename) {
    return res.status(400).send('X-File-Name header missing');
  }
  
  // Clean filename to prevent path traversal
  const safeFilename = path.basename(decodeURIComponent(filename));
  const filepath = path.join(UPLOAD_DIR, safeFilename);
  const writeStream = fs.createWriteStream(filepath);
  
  req.pipe(writeStream);
  
  req.on('end', () => {
    res.status(200).send('Upload complete');
  });
  
  writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error writing file');
  });
});

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 High-Speed QuickShare Server Running!`);
  console.log(`========================================`);
  console.log(`📁 Sharing Folder: ${UPLOAD_DIR}`);
  console.log(`========================================`);
  console.log(`Access the UI from your phone at:`);
  getLocalIPs().forEach(ip => {
    console.log(`-> http://${ip}:${PORT}`);
  });
  console.log(`========================================\n`);
  
  // Attempt to open the browser on the host machine
  const exec = require('child_process').exec;
  const url = `http://localhost:${PORT}`;
  const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
  exec(`${start} ${url}`);
});
