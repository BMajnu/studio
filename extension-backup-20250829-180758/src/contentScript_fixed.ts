// Screenshot button handler section for integration
    
    // Screenshot button handler
    (toolbarShadow!.getElementById('btn-screenshot') as HTMLButtonElement).addEventListener('click', async () => {
      suppressHideUntil = Date.now() + 500;
      hideToolbar();
      
      // Send message to background script to capture screenshot
      chrome.runtime.sendMessage({ type: 'CAPTURE_SCREENSHOT' }, (response) => {
        if (response && response.dataUrl) {
          // Create a new window to display the screenshot
          const screenshotWindow = window.open('', 'DesAInR Screenshot', 'width=900,height=700,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
          
          if (screenshotWindow) {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>DesAInR Screenshot</title>
                <style>
                  body { 
                    font-family: system-ui, -apple-system, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .container {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    width: 90%;
                    max-width: 1200px;
                  }
                  .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e5e7eb;
                  }
                  h1 { 
                    margin: 0; 
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 600;
                  }
                  .actions {
                    display: flex;
                    gap: 12px;
                  }
                  button {
                    padding: 10px 18px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  }
                  .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                  }
                  .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                  }
                  .btn-secondary {
                    background: #f3f4f6;
                    color: #4b5563;
                  }
                  .btn-secondary:hover {
                    background: #e5e7eb;
                  }
                  .screenshot-container {
                    text-align: center;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 12px;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    cursor: zoom-in;
                  }
                  .info {
                    margin-top: 16px;
                    padding: 12px;
                    background: white;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #6b7280;
                    border: 1px solid #e5e7eb;
                  }
                  .zoom-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 1000;
                    cursor: zoom-out;
                  }
                  .zoom-modal img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    max-width: 95%;
                    max-height: 95%;
                    box-shadow: none;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>📸 DesAInR Screenshot</h1>
                    <div class="actions">
                      <button class="btn-secondary" onclick="copyToClipboard()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/>
                        </svg>
                        Copy
                      </button>
                      <button class="btn-primary" onclick="downloadImage()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Download
                      </button>
                      <button class="btn-secondary" onclick="window.close()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        Close
                      </button>
                    </div>
                  </div>
                  <div class="screenshot-container">
                    <img id="screenshot" src="\${response.dataUrl}" alt="Screenshot" onclick="toggleZoom()" />
                    <div class="info">
                      📅 Captured on \${new Date().toLocaleString()} • Click image to zoom • Right-click to save
                    </div>
                  </div>
                </div>
                <div id="zoomModal" class="zoom-modal" onclick="toggleZoom()">
                  <img src="\${response.dataUrl}" alt="Screenshot" />
                </div>
                <script>
                  function downloadImage() {
                    const link = document.createElement('a');
                    link.href = document.getElementById('screenshot').src;
                    link.download = 'desainr-screenshot-' + Date.now() + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                  
                  function copyToClipboard() {
                    const img = document.getElementById('screenshot');
                    fetch(img.src)
                      .then(res => res.blob())
                      .then(blob => {
                        const item = new ClipboardItem({ 'image/png': blob });
                        navigator.clipboard.write([item])
                          .then(() => alert('Screenshot copied to clipboard!'))
                          .catch(err => alert('Failed to copy: ' + err));
                      });
                  }
                  
                  function toggleZoom() {
                    const modal = document.getElementById('zoomModal');
                    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
                  }
                </script>
              </body>
              </html>
            `;
            screenshotWindow.document.write(htmlContent);
            screenshotWindow.document.close();
          }
        } else {
          showOverlayMessage('Failed to capture screenshot: ' + (response?.error || 'Unknown error'));
        }
      });
    });
