document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const filesList = document.getElementById('files-list');
    const refreshBtn = document.getElementById('refresh-btn');
    
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const speedText = document.getElementById('speed-text');

    // Load files initially
    fetchFiles();

    // Event Listeners for Drop Zone
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    refreshBtn.addEventListener('click', () => {
        fetchFiles();
        refreshBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => refreshBtn.style.transform = '', 300);
    });

    async function fetchFiles() {
        try {
            const res = await fetch('/api/files');
            const files = await res.json();
            renderFiles(files);
        } catch (error) {
            console.error('Error fetching files:', error);
            filesList.innerHTML = '<div class="empty-state">Error loading files</div>';
        }
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function renderFiles(files) {
        if (files.length === 0) {
            filesList.innerHTML = '<div class="empty-state">No files available</div>';
            return;
        }

        filesList.innerHTML = '';
        files.forEach(file => {
            const date = new Date(file.mtime).toLocaleString();
            const size = formatBytes(file.size);
            
            // Determine icon based on extension
            let iconClass = 'fa-file';
            const ext = file.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) iconClass = 'fa-file-image';
            else if (['mp4', 'mkv', 'avi'].includes(ext)) iconClass = 'fa-file-video';
            else if (['mp3', 'wav'].includes(ext)) iconClass = 'fa-file-audio';
            else if (['zip', 'rar', '7z'].includes(ext)) iconClass = 'fa-file-zipper';
            else if (['pdf'].includes(ext)) iconClass = 'fa-file-pdf';
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fa-solid ${iconClass} file-icon"></i>
                    <div class="file-details">
                        <span class="file-name" title="${file.name}">${file.name}</span>
                        <span class="file-meta">${size} • ${date}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <a href="/api/download/${encodeURIComponent(file.name)}" download="${file.name}" class="btn-download" title="Download">
                        <i class="fa-solid fa-download"></i>
                    </a>
                    <button class="btn-delete" data-filename="${file.name}" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            filesList.appendChild(fileItem);
        });

        // Add delete event listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const filename = e.currentTarget.dataset.filename;
                if (confirm(`Delete ${filename}?`)) {
                    await fetch(`/api/files/${encodeURIComponent(filename)}`, { method: 'DELETE' });
                    fetchFiles();
                }
            });
        });
    }

    async function handleFiles(fileList) {
        // Upload sequentially to avoid network congestion
        for (let i = 0; i < fileList.length; i++) {
            await uploadFile(fileList[i], i + 1, fileList.length);
        }
        fetchFiles();
        
        // Reset UI after 2 seconds
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 2000);
    }

    function uploadFile(file, currentIndex, totalFiles) {
        return new Promise((resolve, reject) => {
            progressContainer.style.display = 'block';
            progressText.innerText = `Uploading ${currentIndex}/${totalFiles}: ${file.name}`;
            progressFill.style.width = '0%';
            speedText.innerText = '0 MB/s';
            
            let lastTime = Date.now();
            let lastLoaded = 0;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload', true);
            
            // Use custom header for filename to avoid multipart overhead
            xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
            
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    
                    // Calculate Speed
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - lastTime) / 1000; // in seconds
                    
                    if (timeDiff > 0.5) { // update speed every 0.5s
                        const bytesDiff = e.loaded - lastLoaded;
                        const speed = bytesDiff / timeDiff; // bytes per second
                        speedText.innerText = formatBytes(speed) + '/s';
                        
                        lastTime = currentTime;
                        lastLoaded = e.loaded;
                    }
                }
            };
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    progressText.innerText = `Complete: ${file.name}`;
                    resolve();
                } else {
                    progressText.innerText = `Error: ${xhr.statusText}`;
                    reject(xhr.statusText);
                }
            };
            
            xhr.onerror = () => {
                progressText.innerText = `Network Error`;
                reject('Network Error');
            };
            
            // Send raw file
            xhr.send(file);
        });
    }
});
