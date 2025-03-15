// Initialize Chart.js gauge
let gaugeChart;
let testInProgress = false;
let downloadSpeed = 0;
let uploadSpeed = 0;
let pingValue = 0;
let jitterValue = 0;

// DOM Elements
const startButton = document.getElementById('start-test');
const progressBar = document.getElementById('test-progress-bar');
const statusText = document.getElementById('test-status');
const currentSpeedElement = document.getElementById('current-speed');
const downloadSpeedElement = document.getElementById('download-speed');
const uploadSpeedElement = document.getElementById('upload-speed');
const pingValueElement = document.getElementById('ping-value');
const jitterValueElement = document.getElementById('jitter-value');
const packetLossElement = document.getElementById('packet-loss');
const latencyStabilityElement = document.getElementById('latency-stability');
const networkQualityElement = document.getElementById('network-quality');
const dnsResponseElement = document.getElementById('dns-response');
const resultCard = document.getElementById('result-card');
const connectionTypeElement = document.getElementById('connection-type');
const serverLocationElement = document.getElementById('server-location');
const ratingScoreElement = document.getElementById('rating-score');
const connectionRatingElement = document.getElementById('connection-rating');
const speedComparisonElement = document.getElementById('speed-comparison');
const recommendationsList = document.getElementById('recommendations-list');
const shareResultsButton = document.getElementById('share-results');

// Initialize the gauge chart
function initGauge() {
    const ctx = document.getElementById('gauge-canvas').getContext('2d');
    
    gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    'rgba(0, 247, 255, 0.8)',
                    'rgba(18, 18, 42, 0.3)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            circumference: 270,
            rotation: 135,
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 800,
                easing: 'easeOutCubic'
            },
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            }
        }
    });
}

// Detect connection type
function detectConnectionType() {
    // In a real app, we would use the Network Information API
    // For this demo, we'll simulate detection
    const connectionTypes = ['5G+', 'Fiber Optic', 'Quantum Link', 'Neural Net', 'Satellite+'];
    const randomType = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    
    connectionTypeElement.textContent = randomType;
    
    // Select a server location
    const serverLocations = ['Quantum Node Alpha', 'Orbital Station 9', 'Lunar Data Center', 'Neural Hub 42'];
    const randomServer = serverLocations[Math.floor(Math.random() * serverLocations.length)];
    
    serverLocationElement.textContent = randomServer;
}

// Simulate download test
async function runDownloadTest() {
    statusText.textContent = 'Testing download speed...';
    
    // Simulate a realistic download test with fluctuations
    let progress = 0;
    // Reduced max speed to a more realistic range between 10 and 100 Mbps
    let maxSpeed = Math.random() * 90 + 10;
    
    return new Promise(resolve => {
        const interval = setInterval(() => {
            progress += 1; // Smaller increments for smoother progress
            progressBar.style.width = `${progress}%`;
            
            // Simulate speed fluctuations with smoother curve
            const currentProgress = Math.min(progress, 100) / 100;
            // Using cubic bezier curve approximation for smoother fluctuations
            const t = currentProgress;
            const speedFactor = 0.3 + 0.7 * (3 * Math.pow(1-t, 2) * t + 3 * (1-t) * Math.pow(t, 2) + Math.pow(t, 3));
            const currentSpeed = maxSpeed * speedFactor * currentProgress;
            
            // Update the gauge
            updateGauge(currentSpeed);
            currentSpeedElement.textContent = currentSpeed.toFixed(1);
            
            if (progress >= 50) {
                clearInterval(interval);
                downloadSpeed = maxSpeed; // Final download speed
                downloadSpeedElement.textContent = `${downloadSpeed.toFixed(1)} Mbps`;
                // Ensure the current speed display matches the final download speed
                currentSpeedElement.textContent = downloadSpeed.toFixed(1);
                resolve();
            }
        }, 80); // Faster interval for smoother animation
    });
}

// Simulate upload test
async function runUploadTest() {
    statusText.textContent = 'Testing upload speed...';
    
    // Simulate a realistic upload test with fluctuations
    let progress = 50;
    // Upload is typically slower than download (30-70% of download speed)
    let maxSpeed = downloadSpeed * (0.3 + Math.random() * 0.4);
    
    return new Promise(resolve => {
        const interval = setInterval(() => {
            progress += 1; // Smaller increments for smoother progress
            progressBar.style.width = `${progress}%`;
            
            // Simulate speed fluctuations with smoother curve
            const currentProgress = Math.min((progress - 50) / 50, 1);
            // Using cubic bezier curve approximation for smoother fluctuations
            const t = currentProgress;
            const speedFactor = 0.3 + 0.7 * (3 * Math.pow(1-t, 2) * t + 3 * (1-t) * Math.pow(t, 2) + Math.pow(t, 3));
            const currentSpeed = maxSpeed * speedFactor * Math.max(currentProgress, 0.1);
            
            // Update the gauge
            updateGauge(currentSpeed);
            currentSpeedElement.textContent = currentSpeed.toFixed(1);
            
            if (progress >= 100) {
                clearInterval(interval);
                uploadSpeed = maxSpeed; // Final upload speed
                uploadSpeedElement.textContent = `${uploadSpeed.toFixed(1)} Mbps`;
                // Ensure the current speed display matches the final upload speed
                currentSpeedElement.textContent = uploadSpeed.toFixed(1);
                resolve();
            }
        }, 80); // Faster interval for smoother animation
    });
}

// Simulate ping and jitter test
async function runPingTest() {
    statusText.textContent = 'Measuring latency...';
    
    return new Promise(resolve => {
        setTimeout(() => {
            // Generate realistic ping values based on connection quality
            if (downloadSpeed > 50) {
                // Very fast connection
                pingValue = Math.random() * 10 + 1; // 1-11ms
                jitterValue = Math.random() * 2 + 0.1; // 0.1-2.1ms
            } else if (downloadSpeed > 20) {
                // Fast connection
                pingValue = Math.random() * 15 + 8; // 8-23ms
                jitterValue = Math.random() * 3 + 0.5; // 0.5-3.5ms
            } else {
                // Average connection
                pingValue = Math.random() * 25 + 15; // 15-40ms
                jitterValue = Math.random() * 5 + 1; // 1-6ms
            }
            
            pingValueElement.textContent = `${pingValue.toFixed(1)} ms`;
            jitterValueElement.textContent = `${jitterValue.toFixed(1)} ms`;
            
            resolve();
        }, 1000);
    });
}

// Simulate advanced metrics test
async function runAdvancedTests() {
    statusText.textContent = 'Analyzing network quality...';
    
    return new Promise(resolve => {
        setTimeout(() => {
            // Packet loss
            const packetLoss = Math.random() * 0.5;
            packetLossElement.textContent = `${packetLoss.toFixed(2)}%`;
            
            // Latency stability
            const stabilityRatings = ['Excellent', 'Very Good', 'Good', 'Average'];
            const stabilityIndex = Math.min(Math.floor(jitterValue / 2), stabilityRatings.length - 1);
            latencyStabilityElement.textContent = stabilityRatings[stabilityIndex];
            
            // Network quality
            let qualityScore;
            if (downloadSpeed > 50 && pingValue < 10) {
                qualityScore = 'A+';
            } else if (downloadSpeed > 30 && pingValue < 20) {
                qualityScore = 'A';
            } else if (downloadSpeed > 10 && pingValue < 30) {
                qualityScore = 'B+';
            } else {
                qualityScore = 'B';
            }
            networkQualityElement.textContent = qualityScore;
            
            // DNS response
            const dnsResponse = Math.random() * 15 + 5;
            dnsResponseElement.textContent = `${dnsResponse.toFixed(1)} ms`;
            
            resolve();
        }, 1500);
    });
}

// Update the gauge chart
function updateGauge(speed) {
    // Map speed to a percentage (max 100 Mbps instead of 1000)
    const percentage = Math.min(speed / 100, 1) * 100;
    
    gaugeChart.data.datasets[0].data = [percentage, 100 - percentage];
    gaugeChart.update();
}

// Generate test results
function generateResults() {
    // Show the result card
    resultCard.classList.remove('hidden');
    
    // Set rating score
    let ratingScore;
    let ratingText;
    
    if (downloadSpeed > 50 && pingValue < 10) {
        ratingScore = 'A+';
        ratingText = 'excellent';
    } else if (downloadSpeed > 30 && pingValue < 20) {
        ratingScore = 'A';
        ratingText = 'very good';
    } else if (downloadSpeed > 10 && pingValue < 30) {
        ratingScore = 'B+';
        ratingText = 'good';
    } else {
        ratingScore = 'B';
        ratingText = 'decent';
    }
    
    ratingScoreElement.textContent = ratingScore;
    connectionRatingElement.textContent = ratingText;
    
    // Set speed comparison
    let comparisonText;
    if (downloadSpeed > 80) {
        comparisonText = 'faster than 99%';
    } else if (downloadSpeed > 50) {
        comparisonText = 'faster than 95%';
    } else if (downloadSpeed > 30) {
        comparisonText = 'faster than 85%';
    } else if (downloadSpeed > 10) {
        comparisonText = 'faster than 70%';
    } else {
        comparisonText = 'faster than 50%';
    }
    
    speedComparisonElement.textContent = comparisonText;
    
    // Generate recommendations
    const recommendations = [];
    
    if (downloadSpeed > 50) {
        recommendations.push('Your connection is optimized for streaming 4K content');
        recommendations.push('Great for cloud gaming with low latency');
        recommendations.push('Suitable for multiple concurrent high-bandwidth activities');
        recommendations.push('Video conferencing in high quality with minimal lag');
    } else if (downloadSpeed > 30) {
        recommendations.push('Your connection is suitable for HD streaming and VR experiences');
        recommendations.push('Good for most cloud gaming applications');
        recommendations.push('Can handle multiple high-bandwidth activities simultaneously');
    } else if (downloadSpeed > 10) {
        recommendations.push('Your connection is suitable for HD streaming and video calls');
        recommendations.push('Adequate for most online gaming');
        recommendations.push('Consider upgrading for better future-ready performance');
    } else {
        recommendations.push('Your connection may struggle with high-definition content');
        recommendations.push('Consider upgrading your plan for better performance');
        recommendations.push('Limit the number of connected devices during important tasks');
    }
    
    // Update recommendations list
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Save test result to history
    saveTestToHistory({
        timestamp: new Date().toISOString(),
        downloadSpeed: downloadSpeed,
        uploadSpeed: uploadSpeed,
        pingValue: pingValue,
        jitterValue: jitterValue,
        rating: ratingScore,
        connectionType: connectionTypeElement.textContent,
        serverLocation: serverLocationElement.textContent
    });
}

// Save test result to history
function saveTestToHistory(testResult) {
    // Get existing history
    let history = localStorage.getItem('speedTestHistory');
    history = history ? JSON.parse(history) : [];
    
    // Add new test result
    history.push(testResult);
    
    // Save back to localStorage
    localStorage.setItem('speedTestHistory', JSON.stringify(history));
}

// Run the complete speed test
async function runSpeedTest() {
    if (testInProgress) return;
    
    testInProgress = true;
    startButton.disabled = true;
    resultCard.classList.add('hidden');
    
    try {
        // Reset values
        progressBar.style.width = '0%';
        currentSpeedElement.textContent = '0';
        statusText.textContent = 'Initializing test...';
        
        // Run tests in sequence
        await new Promise(resolve => setTimeout(resolve, 1000)); // Initialization delay
        await runDownloadTest();
        await runUploadTest();
        await runPingTest();
        await runAdvancedTests();
        
        // Complete
        statusText.textContent = 'Test completed';
        // Don't reset the current speed to 0, keep the last test result visible
        // currentSpeedElement.textContent = '0';
        // updateGauge(0);
        
        // Generate and display results
        generateResults();
    } catch (error) {
        console.error('Test error:', error);
        statusText.textContent = 'Test failed. Please try again.';
    } finally {
        testInProgress = false;
        startButton.disabled = false;
    }
}

// Share results
function shareResults() {
    // In a real app, this would generate a shareable link or image
    alert('Results copied to clipboard! (This would actually share results in a real app)');
}

// Initialize the app
function initApp() {
    initGauge();
    detectConnectionType();
    
    // Initially hide all test details
    document.querySelector('.speed-test-header').classList.remove('visible');
    document.querySelector('.speed-display').classList.remove('visible');
    document.querySelector('.test-progress').classList.remove('visible');
    document.querySelector('.advanced-metrics').classList.remove('visible');
    
    // Event listeners
    startButton.addEventListener('click', handleStartButtonClick);
    shareResultsButton.addEventListener('click', shareResults);
    
    // Add futuristic UI effects
    addFuturisticEffects();
}

// Handle start button click
function handleStartButtonClick() {
    if (testInProgress) return;
    
    // Show test details with staggered animations
    const elements = [
        document.querySelector('.speed-test-header'),
        document.querySelector('.speed-display'),
        document.querySelector('.test-progress'),
        document.querySelector('.advanced-metrics')
    ];
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible', 'fade-in-up');
        }, index * 250); // Increased delay between animations for smoother staggered effect
    });
    
    // Start the test after a short delay
    setTimeout(() => {
        runSpeedTest();
    }, 1000); // Increased delay before starting test
}

// Add some extra futuristic UI effects
function addFuturisticEffects() {
    // Create particle effects for the gauge
    createParticleEffects();
    
    // Add holographic data flow animations
    addDataFlowAnimations();
    
    // Simulate occasional data transmission animations
    setInterval(() => {
        if (!testInProgress) {
            const randomFlicker = Math.random() * 5;
            if (randomFlicker < 0.3) {
                // Simulate a data packet transmission with more advanced effects
                const currentValue = parseFloat(currentSpeedElement.textContent);
                currentSpeedElement.textContent = (currentValue + Math.random() * 2).toFixed(1);
                
                // Add a pulse effect to the gauge
                const gaugeContainer = document.querySelector('.gauge-container');
                gaugeContainer.classList.add('pulse-effect');
                
                // Add a data transmission effect
                simulateDataTransmission();
                
                setTimeout(() => {
                    if (!testInProgress) {
                        currentSpeedElement.textContent = '0';
                        gaugeContainer.classList.remove('pulse-effect');
                    }
                }, 500);
            }
        }
    }, 2000);
    
    // Add ambient background animations
    animateBackground();
}

// Create particle effects around the gauge
function createParticleEffects() {
    const gaugeContainer = document.querySelector('.gauge-container');
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    gaugeContainer.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--delay', `${Math.random() * 5}s`);
        particle.style.setProperty('--size', `${Math.random() * 5 + 1}px`);
        particle.style.setProperty('--distance', `${Math.random() * 50 + 70}px`);
        particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        particle.style.setProperty('--speed', `${Math.random() * 10 + 10}s`);
        
        // Randomly assign colors
        const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)', 'var(--tertiary-color)'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        particleContainer.appendChild(particle);
    }
}

// Add holographic data flow animations
function addDataFlowAnimations() {
    const speedTestCard = document.querySelector('.speed-test-card');
    
    // Create data flow container
    const dataFlowContainer = document.createElement('div');
    dataFlowContainer.className = 'data-flow-container';
    speedTestCard.appendChild(dataFlowContainer);
    
    // Create data streams
    for (let i = 0; i < 5; i++) {
        const dataStream = document.createElement('div');
        dataStream.className = 'data-stream';
        dataStream.style.setProperty('--delay', `${Math.random() * 5}s`);
        dataStream.style.setProperty('--duration', `${Math.random() * 5 + 5}s`);
        dataStream.style.setProperty('--top', `${Math.random() * 100}%`);
        dataFlowContainer.appendChild(dataStream);
    }
}

// Simulate data transmission with visual effects
function simulateDataTransmission() {
    const speedTestCard = document.querySelector('.speed-test-card');
    
    // Create a data packet element
    const dataPacket = document.createElement('div');
    dataPacket.className = 'data-packet';
    
    // Random position and path
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;
    
    dataPacket.style.setProperty('--start-x', `${startX}%`);
    dataPacket.style.setProperty('--start-y', `${startY}%`);
    dataPacket.style.setProperty('--end-x', `${endX}%`);
    dataPacket.style.setProperty('--end-y', `${endY}%`);
    
    speedTestCard.appendChild(dataPacket);
    
    // Remove after animation completes
    setTimeout(() => {
        dataPacket.remove();
    }, 1000);
}

// Add ambient background animations
function animateBackground() {
    // Create a canvas for background effects if it doesn't exist
    if (!document.getElementById('background-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'background-canvas';
        document.body.prepend(canvas);
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Style the canvas
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.3';
        
        // Initialize the animation
        initBackgroundAnimation(canvas);
    }
}

// Initialize background animation
function initBackgroundAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const points = [];
    
    // Create points
    for (let i = 0; i < 50; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 0.2 - 0.1,
            vy: Math.random() * 0.2 - 0.1,
            size: Math.random() * 2 + 1,
            color: i % 3 === 0 ? 'rgba(0, 247, 255, 0.5)' : 
                   i % 3 === 1 ? 'rgba(255, 0, 230, 0.5)' : 'rgba(125, 0, 255, 0.5)'
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw points
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            
            // Update position
            point.x += point.vx;
            point.y += point.vy;
            
            // Bounce off edges
            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
            
            // Draw point
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < points.length; j++) {
                const otherPoint = points[j];
                const dx = point.x - otherPoint.x;
                const dy = point.y - otherPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(otherPoint.x, otherPoint.y);
                    ctx.strokeStyle = `rgba(0, 247, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);