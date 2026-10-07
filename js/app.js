let map;
let darkMode = false;

function initMap() {
    const defaultCenter = [37.7749, -122.4194];
    const defaultZoom = 11;

    map = L.map('map').setView(defaultCenter, defaultZoom);

    // Satellite layer
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
    });

    // Light layer (for dark mode toggle)
    const lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    });

    // Start with satellite view
    satelliteLayer.addTo(map);
    map.satelliteLayer = satelliteLayer;
    map.lightLayer = lightLayer;

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Load system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDarkMode();
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').textContent = darkMode ? '☀️' : '🌙';
    
    // Refresh map for proper rendering
    map.invalidateSize();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initMap);
