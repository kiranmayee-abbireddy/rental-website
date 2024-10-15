// bookings.js

// Function to get URL parameters
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let match;
    
    while (match = regex.exec(queryString)) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return params;
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data from URL parameters
    const params = getQueryParams();

    // Set journey details
    document.getElementById('pickup-location').textContent = params.pickupLocation || 'Not provided';
    document.getElementById('dropoff-location').textContent = params.dropoffLocation || 'Not provided';
    document.getElementById('pickup-time').textContent = params.pickupTime || 'Not provided';
    document.getElementById('dropoff-time').textContent = params.dropoffTime || 'Not provided';
    document.getElementById('distance-result').textContent = params.distance || 'Not calculated';
    document.getElementById('time-result').textContent = params.time || 'Not calculated';
    document.getElementById('selected-vehicle').textContent = params.selectedVehicle || 'Not selected';
    document.getElementById('estimated-price').textContent = params.price || 'Rs 0';

    // Set customer information
    document.getElementById('customer-name').textContent = params.name || 'Not provided';
    document.getElementById('customer-number').textContent = params.number || 'Not provided';
    document.getElementById('customer-email').textContent = params.email || 'Not provided';
    document.getElementById('customer-address').textContent = params.address || 'Not provided';
});

// Back button function
function goBack() {
    window.history.back();
}
