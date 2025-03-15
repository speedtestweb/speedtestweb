// Share Modal Functionality

// DOM Elements
let shareModal = null;
let modalOverlay = null;

// Initialize share modal
function initShareModal() {
    // Create modal elements if they don't exist
    if (!shareModal) {
        createShareModalElements();
    }
    
    // Add event listeners
    document.getElementById('share-results').addEventListener('click', openShareModal);
    document.getElementById('close-share-modal').addEventListener('click', closeShareModal);
    document.getElementById('share-modal-overlay').addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeShareModal();
        }
    });
    
    // Add event listeners for share buttons
    document.getElementById('share-facebook').addEventListener('click', () => shareToSocial('facebook'));
    document.getElementById('share-twitter').addEventListener('click', () => shareToSocial('twitter'));
    document.getElementById('share-linkedin').addEventListener('click', () => shareToSocial('linkedin'));
    document.getElementById('share-email').addEventListener('click', shareViaEmail);
    document.getElementById('copy-link').addEventListener('click', copyShareableLink);
    document.getElementById('download-image').addEventListener('click', downloadResultImage);
}

// Create share modal elements
function createShareModalElements() {
    // Create modal overlay
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'share-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    
    // Create modal container
    shareModal = document.createElement('div');
    shareModal.id = 'share-modal';
    shareModal.className = 'modal';
    
    // Create modal content
    shareModal.innerHTML = `
        <div class="modal-header">
            <h3>Share Your Results</h3>
            <button id="close-share-modal" class="close-modal">×</button>
        </div>
        <div class="modal-body">
            <div class="share-preview">
                <div class="preview-card">
                    <div class="preview-header">
                        <div class="preview-logo">Speed Test</div>
                    </div>
                    <div class="preview-content">
                        <div class="preview-metrics">
                            <div class="preview-metric">
                                <div class="preview-label">DOWNLOAD</div>
                                <div class="preview-value" id="preview-download">0 Mbps</div>
                            </div>
                            <div class="preview-metric">
                                <div class="preview-label">UPLOAD</div>
                                <div class="preview-value" id="preview-upload">0 Mbps</div>
                            </div>
                            <div class="preview-metric">
                                <div class="preview-label">PING</div>
                                <div class="preview-value" id="preview-ping">0 ms</div>
                            </div>
                        </div>
                        <div class="preview-rating">
                            <div class="preview-score" id="preview-score">A+</div>
                            <div class="preview-date" id="preview-date">Today at 12:00 PM</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="share-options">
                <h4>Share via</h4>
                <div class="social-buttons">
                    <button id="share-facebook" class="social-button facebook">
                        <span class="social-icon">f</span>
                        Facebook
                    </button>
                    <button id="share-twitter" class="social-button twitter">
                        <span class="social-icon">t</span>
                        Twitter
                    </button>
                    <button id="share-linkedin" class="social-button linkedin">
                        <span class="social-icon">in</span>
                        LinkedIn
                    </button>
                    <button id="share-email" class="social-button email">
                        <span class="social-icon">✉</span>
                        Email
                    </button>
                </div>
                <div class="share-actions">
                    <button id="copy-link" class="action-button">
                        <span class="action-icon">🔗</span>
                        Copy Link
                    </button>
                    <button id="download-image" class="action-button">
                        <span class="action-icon">📷</span>
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to overlay
    modalOverlay.appendChild(shareModal);
    
    // Append overlay to body
    document.body.appendChild(modalOverlay);
}

// Open share modal
function openShareModal() {
    // Update preview with current test results
    updateSharePreview();
    
    // Show modal
    modalOverlay.classList.add('active');
    shareModal.classList.add('active');
    
    // Add analytics event (if implemented)
    // trackEvent('share_modal_opened');
}

// Close share modal
function closeShareModal() {
    modalOverlay.classList.remove('active');
    shareModal.classList.remove('active');
}

// Update share preview with current test results
function updateSharePreview() {
    document.getElementById('preview-download').textContent = downloadSpeedElement.textContent;
    document.getElementById('preview-upload').textContent = uploadSpeedElement.textContent;
    document.getElementById('preview-ping').textContent = pingValueElement.textContent;
    document.getElementById('preview-score').textContent = ratingScoreElement.textContent;
    
    // Format current date and time
    const now = new Date();
    const options = { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('preview-date').textContent = now.toLocaleDateString('en-US', options);
}

// Share to social media
function shareToSocial(platform) {
    // Get current URL
    const url = encodeURIComponent(window.location.href);
    
    // Create share text
    const text = encodeURIComponent(`Check out my internet speed test results: Download ${downloadSpeedElement.textContent}, Upload ${uploadSpeedElement.textContent}, Ping ${pingValueElement.textContent}`);
    
    // Define share URLs for different platforms
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    // Open share window
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    
    // Add analytics event (if implemented)
    // trackEvent('share_to_' + platform);
}

// Share via email
function shareViaEmail() {
    const subject = encodeURIComponent('My Internet Speed Test Results');
    const body = encodeURIComponent(
        `Check out my internet speed test results:\n\n` +
        `Download: ${downloadSpeedElement.textContent}\n` +
        `Upload: ${uploadSpeedElement.textContent}\n` +
        `Ping: ${pingValueElement.textContent}\n` +
        `Rating: ${ratingScoreElement.textContent}\n\n` +
        `Tested on: ${new Date().toLocaleString()}\n\n` +
        `Test your own internet speed at: ${window.location.href}`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    // Add analytics event (if implemented)
    // trackEvent('share_via_email');
}

// Copy shareable link
function copyShareableLink() {
    // In a real app, this would generate a unique link with the test results
    // For this demo, we'll just copy the current URL
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = window.location.href;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show success message
    const copyButton = document.getElementById('copy-link');
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '<span class="action-icon">✓</span> Link Copied!';
    
    setTimeout(() => {
        copyButton.innerHTML = originalText;
    }, 2000);
    
    // Add analytics event (if implemented)
    // trackEvent('copy_shareable_link');
}

// Download result as image
function downloadResultImage() {
    // In a real app, this would generate an actual image of the results
    // For this demo, we'll simulate the download
    
    // Show generating message
    const downloadButton = document.getElementById('download-image');
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '<span class="action-icon">⏳</span> Generating...';
    
    setTimeout(() => {
        // Simulate image generation delay
        downloadButton.innerHTML = '<span class="action-icon">✓</span> Downloaded!';
        
        setTimeout(() => {
            downloadButton.innerHTML = originalText;
        }, 2000);
        
        // In a real app, we would use html2canvas or a similar library to capture the results
        // and create a downloadable image
        alert('In a real app, this would download an image of your test results.');
    }, 1500);
    
    // Add analytics event (if implemented)
    // trackEvent('download_result_image');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the main script to initialize first
    setTimeout(initShareModal, 100);
});