// Initialize map
let map;
let trails = [];
let markers = {};

const DIFFICULTY_COLORS = {
    easy: '#6b9d3a',
    moderate: '#d4a373',
    difficult: '#d9534f',
    expert: '#8b0000'
};

const DIFFICULTY_LEVELS = {
    easy: '🟢 Easy',
    moderate: '🟡 Moderate',
    difficult: '🔴 Difficult',
    expert: '⚫ Expert'
};

function initMap() {
    // Default center (San Francisco area - change to your location)
    const defaultCenter = [37.7749, -122.4194];
    const defaultZoom = 11;

    map = L.map('map').setView(defaultCenter, defaultZoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        zoom: defaultZoom
    }).addTo(map);

    // Load trails data
    loadTrails();
}

function loadTrails() {
    fetch('data/trails.json')
        .then(response => response.json())
        .then(data => {
            trails = data.trails || [];
            renderTrails();
            updateStats();
        })
        .catch(error => {
            console.error('Error loading trails:', error);
            showEmptyState();
        });
}

function renderTrails() {
    // Clear existing markers
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    markers = {};

    // Add markers and populate sidebar
    const trailList = document.getElementById('trail-list');
    trailList.innerHTML = '';

    trails.forEach((trail, index) => {
        // Add marker to map
        const marker = L.circleMarker([trail.latitude, trail.longitude], {
            radius: 6,
            fillColor: DIFFICULTY_COLORS[trail.difficulty] || '#007bff',
            color: '#000',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(createPopup(trail));
        marker.on('click', () => selectTrail(index));
        markers[index] = marker;

        // Add to sidebar
        const trailItem = document.createElement('div');
        trailItem.className = 'trail-item';
        trailItem.innerHTML = `
            <div class="trail-name">${trail.name}</div>
            <div class="trail-difficulty">${DIFFICULTY_LEVELS[trail.difficulty] || trail.difficulty}</div>
            ${trail.distance ? `<div class="trail-difficulty">📏 ${trail.distance} mi</div>` : ''}
        `;
        trailItem.addEventListener('click', () => selectTrail(index));
        trailList.appendChild(trailItem);
    });

    // Fit map to all markers if available
    if (trails.length > 0) {
        const group = new L.featureGroup(Object.values(markers));
        map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 14 });
    }
}

function createPopup(trail) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="popup-title">${trail.name}</div>
        <div class="popup-detail"><strong>Difficulty:</strong> ${DIFFICULTY_LEVELS[trail.difficulty] || trail.difficulty}</div>
        ${trail.distance ? `<div class="popup-detail"><strong>Distance:</strong> ${trail.distance} miles</div>` : ''}
        ${trail.elevation ? `<div class="popup-detail"><strong>Elevation Gain:</strong> ${trail.elevation} ft</div>` : ''}
        ${trail.description ? `<div class="popup-detail"><strong>Description:</strong> ${trail.description}</div>` : ''}
    `;
    return div;
}

function selectTrail(index) {
    // Remove active class from all items
    document.querySelectorAll('.trail-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected item
    const trailItems = document.querySelectorAll('.trail-item');
    if (trailItems[index]) {
        trailItems[index].classList.add('active');
    }

    // Center map on trail
    const trail = trails[index];
    map.setView([trail.latitude, trail.longitude], 14);
    markers[index].openPopup();
}

function updateStats() {
    document.getElementById('trail-count').textContent = trails.length;
}

function showEmptyState() {
    const trailList = document.getElementById('trail-list');
    trailList.innerHTML = `
        <p style="text-align: center; color: #999; padding: 2rem 1rem;">
            No trails found. Add trails to <code>data/trails.json</code>
        </p>
    `;
    document.getElementById('trail-count').textContent = '0';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initMap);
