
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
const yyyy = today.getFullYear();

// Format date to YYYY-MM-DD
const formattedDate = yyyy + '-' + mm + '-' + dd;

// Set the min attribute for the date input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pickup-date').setAttribute('min', formattedDate);
});

document.addEventListener("DOMContentLoaded", function() {
    const nameInput = document.getElementById("name");

    // Event listener for keydown event
    nameInput.addEventListener("keydown", function(event) {
        const key = event.key;

        // Allow only alphabets, spaces, backspace, and delete
        if (!/^[A-Za-z\s]$/.test(key) && key !== "Backspace" && key !== "Delete") {
            event.preventDefault(); // Prevent the default action of adding the character
        }
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const numberInput = document.getElementById("mobile-number");
    const errorMessage = document.getElementById("mobilenumber-error");

    numberInput.addEventListener("keydown", function(event){
        const key = event.key;
        if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab") {
            event.preventDefault();
        }

        if (numberInput.value.length >= 10 && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab") {
            event.preventDefault();
        }
    });

    numberInput.addEventListener("blur", function() {
        const value = numberInput.value;
        if (value.length < 10) {
            errorMessage.textContent = "Please enter 10 digits."; // Set error message
            errorMessage.style.display = "block";
        } else {
            errorMessage.textContent = ""; 
            errorMessage.style.display = "none"; 
        }
    });

    function getFullNumber() {
        const countryCode = "+91"; 
        return countryCode + numberInput.value; 
    }
    
    document.getElementById('submit').addEventListener('click', function() {
        const fullNumber = getFullNumber();
        console.log("Full Number: ", fullNumber); // Output the full number with country code
    });
});
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const pickupLocationInput = document.getElementById('pickup-location');

    // Initialize the Google Places Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(pickupLocationInput);
    autocomplete.setTypes(['geocode']); // Limit suggestions to geocode locations

    // Listen for the place changed event
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
        } else {
            // You can use the place details as needed
            console.log("Place details:", place);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const dropoffLocationInput = document.getElementById('dropoff-location');

    // Initialize the Google Places Autocomplete for drop-off location
    const autocomplete = new google.maps.places.Autocomplete(dropoffLocationInput);
    autocomplete.setTypes(['geocode']); // Limit suggestions to geocode locations

    // Listen for the place changed event
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
        } else {
            // You can use the place details as needed
            console.log("Place details:", place);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const pickupLocationInput = document.getElementById('pickup-location');
    const dropoffLocationInput = document.getElementById('dropoff-location');
    const distanceResult = document.getElementById('distance-result');

    // Initialize Google Places Autocomplete for both locations
    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupLocationInput);
    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffLocationInput);
    pickupAutocomplete.setTypes(['geocode']);
    dropoffAutocomplete.setTypes(['geocode']);

    // Function to calculate distance
    function calculateDistance() {
        const pickupPlace = pickupAutocomplete.getPlace();
        const dropoffPlace = dropoffAutocomplete.getPlace();

        if (pickupPlace && dropoffPlace) {
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [pickupPlace.formatted_address],
                destinations: [dropoffPlace.formatted_address],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
            }, displayDistance);
        } else {
            distanceResult.textContent = ""; // Clear the distance result if not valid
        }
    }

    // Display distance in the designated area
    function displayDistance(response, status) {
        if (status == 'OK') {
            const distance = response.rows[0].elements[0].distance.text;
            distanceResult.textContent = `Distance: ${distance}`;
        } else {
            distanceResult.textContent = "Unable to calculate distance.";
        }
    }

    // Add event listeners to calculate distance when locations change
    pickupAutocomplete.addListener('place_changed', calculateDistance);
    dropoffAutocomplete.addListener('place_changed', calculateDistance);
});
document.addEventListener('DOMContentLoaded', function() {
    const pickupDateInput = document.getElementById('pickup-date');
    const pickupTimeInput = document.getElementById('pickup-time');
    const dropoffDateInput = document.getElementById('dropoff-date');
    const dropoffTimeInput = document.getElementById('dropoff-time');
    const timeResult = document.getElementById('time-result');

    function calculateTimeDifference() {
        const pickupDate = new Date(pickupDateInput.value + 'T' + pickupTimeInput.value);
        const dropoffDate = new Date(dropoffDateInput.value + 'T' + dropoffTimeInput.value);

        if (pickupDate && dropoffDate) {
            const timeDifference = dropoffDate - pickupDate; // time difference in milliseconds

            if (timeDifference >= 0) {
                const totalHours = Math.floor(timeDifference / 3600000); // total hours
                const totalDays = Math.floor(totalHours / 24); // calculate total days
                const remainingHours = totalHours % 24; // remaining hours

                // Display result with total days and hours
                timeResult.textContent = `Total Duration: ${totalDays} days and ${remainingHours} hours`;
            } else {
                timeResult.textContent = "Drop-off time must be after pickup time.";
            }
        } else {
            timeResult.textContent = ""; // Clear the result if not valid
        }
    }

    // Add event listeners to calculate time when values change
    pickupDateInput.addEventListener('change', calculateTimeDifference);
    pickupTimeInput.addEventListener('change', calculateTimeDifference);
    dropoffDateInput.addEventListener('change', calculateTimeDifference);
    dropoffTimeInput.addEventListener('change', calculateTimeDifference);
});
// Ensure this code is wrapped in a script tag or a separate JS file
document.addEventListener('DOMContentLoaded', function () {
    const viewVehiclesButton = document.getElementById('view-vehicles');
    const carOptions = document.getElementById('car-options');

    viewVehiclesButton.addEventListener('click', function () {
        // Toggle the display of the car options
        if (carOptions.style.display === 'none' || carOptions.style.display === '') {
            carOptions.style.display = 'flex'; // Show the car options
        } else {
            carOptions.style.display = 'none'; // Hide the car options
        }
    });
});
