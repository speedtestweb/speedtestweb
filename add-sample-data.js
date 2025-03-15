// Script to add sample speed test history data to localStorage

// This script should be included in an HTML page to work with localStorage

// Sample data with different dates and speeds
const sampleData = [
    {
        downloadSpeed: 95.2,
        uploadSpeed: 25.8,
        pingValue: 15.3,
        jitterValue: 2.1,
        rating: 'A+',
        connectionType: 'Wi-Fi',
        serverLocation: 'New York',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
        downloadSpeed: 87.5,
        uploadSpeed: 22.3,
        pingValue: 18.7,
        jitterValue: 3.2,
        rating: 'A',
        connectionType: 'Wi-Fi',
        serverLocation: 'New York',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
        downloadSpeed: 105.8,
        uploadSpeed: 28.9,
        pingValue: 12.1,
        jitterValue: 1.8,
        rating: 'A+',
        connectionType: 'Ethernet',
        serverLocation: 'Chicago',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    },
    {
        downloadSpeed: 75.3,
        uploadSpeed: 18.5,
        pingValue: 22.4,
        jitterValue: 4.5,
        rating: 'B+',
        connectionType: 'Wi-Fi',
        serverLocation: 'Dallas',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
    },
    {
        downloadSpeed: 110.2,
        uploadSpeed: 32.7,
        pingValue: 10.8,
        jitterValue: 1.2,
        rating: 'A+',
        connectionType: 'Ethernet',
        serverLocation: 'San Francisco',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    }
];

// Add sample data to localStorage
function addSampleData() {
    // Get existing history or initialize empty array
    let history = localStorage.getItem('speedTestHistory');
    history = history ? JSON.parse(history) : [];
    
    // Add sample data
    history = [...history, ...sampleData];
    
    // Save back to localStorage
    localStorage.setItem('speedTestHistory', JSON.stringify(history));
    
    console.log('Sample speed test history data added successfully!');
    console.log(`Total history items: ${history.length}`);
    
    // Reload the page to show the updated history
    window.location.reload();
}

// The button creation code has been removed
// The addSampleData function is still available for testing purposes if needed
// To use it, call addSampleData() from the browser console
// Example: Open browser console and type: addSampleData()

// No longer adding the button to the UI
// The function remains available for programmatic use

// Don't automatically execute the function
// The function will be called when the button is clicked