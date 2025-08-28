// Map functionality for listings using Leaflet (OpenStreetMap)

// Initialize map for individual listing
function initMap(coordinates, title) {
    try {
        if (!coordinates || coordinates[0] === 0 && coordinates[1] === 0) {
            document.getElementById("map").innerHTML = '<p>Location not available for this listing.</p>';
            return;
        }

        // Create map centered on the listing location
        const map = L.map('map').setView([coordinates[1], coordinates[0]], 15);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker for the listing
        const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
        marker.bindPopup(`<b>${title}</b>`).openPopup();

    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById("map").innerHTML = '<p>Map could not be loaded. Please check your internet connection.</p>';
    }
}

// Initialize cluster map for all listings
function initClusterMap(listings) {
    try {
        // Create map centered on world view
        const map = L.map('cluster-map').setView([20, 0], 2);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create marker cluster group
        const markers = L.markerClusterGroup();

        // Add markers for each listing
        let validListings = 0;
        listings.forEach((listing) => {
            if (listing.geometry && listing.geometry.coordinates &&
                listing.geometry.coordinates[0] !== 0 && listing.geometry.coordinates[1] !== 0) {

                const marker = L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]]);

                // Create popup content
                const popupContent = `
                    <div style="text-align: center;">
                        <h6><b>${listing.title}</b></h6>
                        <p>₹${listing.price ? listing.price.toLocaleString("en-IN") : 'N/A'}/night</p>
                        <p>${listing.location}, ${listing.country}</p>
                        <a href="/listings/${listing._id}" class="btn btn-sm btn-primary">View Details</a>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markers.addLayer(marker);
                validListings++;
            }
        });

        // Add the marker cluster group to the map
        map.addLayer(markers);

        if (validListings === 0) {
            document.getElementById("cluster-map").innerHTML = '<p>No listings with valid coordinates found.</p>';
        }

    } catch (error) {
        console.error('Error initializing cluster map:', error);
        document.getElementById("cluster-map").innerHTML = '<p>Map could not be loaded. Please check your internet connection.</p>';
    }
}

// Initialize map for edit page
function initEditMap(coordinates, title) {
    try {
        if (!coordinates || coordinates[0] === 0 && coordinates[1] === 0) {
            document.getElementById("edit-map").innerHTML = '<p>Location not available for this listing.</p>';
            return;
        }

        // Create map centered on the listing location
        const map = L.map('edit-map').setView([coordinates[1], coordinates[0]], 15);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker for the listing
        const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
        marker.bindPopup(`<b>${title}</b><br>Current location`).openPopup();

    } catch (error) {
        console.error('Error initializing edit map:', error);
        document.getElementById("edit-map").innerHTML = '<p>Map could not be loaded. Please check your internet connection.</p>';
    }
}

// Initialize map for new listing page
function initNewListingMap() {
    try {
        // Create map with default world view
        const map = L.map('new-map').setView([20, 0], 2);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a default marker (can be updated when user enters location)
        const marker = L.marker([20, 0]).addTo(map);
        marker.bindPopup('Enter location details above to see preview').openPopup();

        // Store map reference for potential updates
        window.newListingMap = map;
        window.newListingMarker = marker;

    } catch (error) {
        console.error('Error initializing new listing map:', error);
        document.getElementById("new-map").innerHTML = '<p>Map could not be loaded. Please check your internet connection.</p>';
    }
}
