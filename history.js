// DOM Elements
const timeFilter = document.getElementById('time-filter');
const clearHistoryButton = document.getElementById('clear-history');
const listViewButton = document.getElementById('list-view-btn');
const chartViewButton = document.getElementById('chart-view-btn');
const historyList = document.getElementById('history-list');
const historyChart = document.getElementById('history-chart');
const emptyHistoryMessage = document.getElementById('empty-history-message');
const historyCanvas = document.getElementById('history-canvas');

// Constants
const HISTORY_THRESHOLD = 20; // Number of items before showing warning

// Chart instance
let historyChartInstance = null;

// Initialize the history page
function initHistoryPage() {
    console.log('Initializing history page...');
    // Load and display history
    displayHistory();
    
    // Set up event listeners
    timeFilter.addEventListener('change', displayHistory);
    clearHistoryButton.addEventListener('click', clearHistory);
    listViewButton.addEventListener('click', () => switchView('list'));
    chartViewButton.addEventListener('click', () => switchView('chart'));
}

// Get history from localStorage
function getHistory() {
    const history = localStorage.getItem('speedTestHistory');
    console.log('Retrieved history:', history ? JSON.parse(history).length + ' items' : 'none');
    return history ? JSON.parse(history) : [];
}

// Save history to localStorage
function saveHistory(history) {
    localStorage.setItem('speedTestHistory', JSON.stringify(history));
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all test history?')) {
        localStorage.removeItem('speedTestHistory');
        displayHistory();
    }
}

// Filter history based on time period
function filterHistory(history) {
    const filterValue = timeFilter.value;
    const now = new Date();
    
    if (filterValue === 'all') {
        return history;
    }
    
    let cutoffDate;
    switch (filterValue) {
        case 'week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            return history;
    }
    
    return history.filter(item => new Date(item.timestamp) > cutoffDate);
}

// Display history in the selected view
function displayHistory() {
    const history = getHistory();
    const filteredHistory = filterHistory(history);
    
    console.log('Displaying history:', filteredHistory.length + ' items after filtering');
    
    // Show/hide empty message
    if (filteredHistory.length === 0) {
        emptyHistoryMessage.classList.remove('hidden');
    } else {
        emptyHistoryMessage.classList.add('hidden');
    }
    
    // Update the current view
    if (historyList.classList.contains('hidden')) {
        displayChartView(filteredHistory);
    } else {
        displayListView(filteredHistory);
    }
}

// Display history in list view
function displayListView(history) {
    // Clear previous items (except empty message)
    const items = historyList.querySelectorAll('.history-item');
    items.forEach(item => item.remove());
    
    // Remove any existing warning message
    const existingWarning = historyList.querySelector('.history-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    // Sort history by date (newest first)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show/hide empty message based on history length
    if (history.length === 0) {
        emptyHistoryMessage.classList.remove('hidden');
        // Make sure empty message is in the list
        if (!historyList.contains(emptyHistoryMessage)) {
            historyList.appendChild(emptyHistoryMessage);
        }
    } else {
        // Remove empty message from DOM completely when there are history items
        if (historyList.contains(emptyHistoryMessage)) {
            historyList.removeChild(emptyHistoryMessage);
        }
        
        // Check if history exceeds threshold and show warning
        if (history.length >= HISTORY_THRESHOLD) {
            const warningMessage = document.createElement('div');
            warningMessage.className = 'history-warning';
            warningMessage.innerHTML = `
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <h3>Your history list is getting full</h3>
                    <p>Consider clearing some history to maintain optimal performance</p>
                </div>
                <button id="warning-clear-btn" class="warning-button">Clear History</button>
            `;
            historyList.insertBefore(warningMessage, historyList.firstChild);
            
            // Add event listener to the warning clear button
            const warningClearBtn = document.getElementById('warning-clear-btn');
            warningClearBtn.addEventListener('click', clearHistory);
        }
    }
    
    // Add history items
    history.forEach((item, index) => {
        const historyItem = createHistoryItem(item, index);
        historyList.appendChild(historyItem);
    });
}

// Create a history item element
function createHistoryItem(item, index) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.dataset.index = index;
    
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    historyItem.innerHTML = `
        <div class="history-item-header">
            <div class="history-date">${formattedDate}</div>
            <div class="history-rating ${getRatingClass(item.rating)}">${item.rating}</div>
        </div>
        <div class="history-item-details">
            <div class="history-detail">
                <div class="detail-label">DOWNLOAD</div>
                <div class="detail-value">${item.downloadSpeed.toFixed(1)} Mbps</div>
            </div>
            <div class="history-detail">
                <div class="detail-label">UPLOAD</div>
                <div class="detail-value">${item.uploadSpeed.toFixed(1)} Mbps</div>
            </div>
            <div class="history-detail">
                <div class="detail-label">PING</div>
                <div class="detail-value">${item.pingValue.toFixed(1)} ms</div>
            </div>
            <div class="history-detail">
                <div class="detail-label">JITTER</div>
                <div class="detail-value">${item.jitterValue.toFixed(1)} ms</div>
            </div>
        </div>
        <div class="history-item-footer">
            <div class="connection-type">${item.connectionType}</div>
            <button class="delete-history-item" data-index="${index}">Delete</button>
        </div>
    `;
    
    // Add event listener for delete button
    const deleteButton = historyItem.querySelector('.delete-history-item');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteHistoryItem(index);
    });
    
    return historyItem;
}

// Get CSS class for rating
function getRatingClass(rating) {
    switch(rating) {
        case 'A+': return 'rating-a-plus';
        case 'A': return 'rating-a';
        case 'B+': return 'rating-b-plus';
        case 'B': return 'rating-b';
        default: return '';
    }
}

// Delete a specific history item
function deleteHistoryItem(index) {
    if (confirm('Delete this test result?')) {
        const history = getHistory();
        history.splice(index, 1);
        saveHistory(history);
        displayHistory();
    }
}

// Display history in chart view
function displayChartView(history) {
    // Sort history by date (oldest first for chart)
    history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Prepare data for chart
    const labels = history.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const downloadData = history.map(item => item.downloadSpeed);
    const uploadData = history.map(item => item.uploadSpeed);
    const pingData = history.map(item => item.pingValue);
    
    // Destroy previous chart if it exists
    if (historyChartInstance) {
        historyChartInstance.destroy();
    }
    
    // Create new chart
    const ctx = historyCanvas.getContext('2d');
    historyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Download (Mbps)',
                    data: downloadData,
                    borderColor: 'rgba(0, 247, 255, 1)',
                    backgroundColor: 'rgba(0, 247, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Upload (Mbps)',
                    data: uploadData,
                    borderColor: 'rgba(255, 0, 247, 1)',
                    backgroundColor: 'rgba(255, 0, 247, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Ping (ms)',
                    data: pingData,
                    borderColor: 'rgba(255, 247, 0, 1)',
                    backgroundColor: 'rgba(255, 247, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Speed (Mbps)',
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Ping (ms)',
                        color: 'rgba(255, 247, 0, 0.7)'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: 'rgba(255, 247, 0, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Switch between list and chart views
function switchView(view) {
    if (view === 'list') {
        historyList.classList.remove('hidden');
        historyChart.classList.add('hidden');
        listViewButton.classList.add('active');
        chartViewButton.classList.remove('active');
        displayListView(filterHistory(getHistory()));
    } else {
        historyList.classList.add('hidden');
        historyChart.classList.remove('hidden');
        listViewButton.classList.remove('active');
        chartViewButton.classList.add('active');
        displayChartView(filterHistory(getHistory()));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initHistoryPage);