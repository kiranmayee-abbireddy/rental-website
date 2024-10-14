
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
    const numberInput = document.getElementById("mobile");
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
document.addEventListener('DOMContentLoaded', function () {
    const pickupLocationInput = document.getElementById('pickup-location');
    const dropoffLocationInput = document.getElementById('dropoff-location');
    const distanceResult = document.getElementById('distance-result');
    const timeResult = document.getElementById('time-result');

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupLocationInput);
    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffLocationInput);
    pickupAutocomplete.setTypes(['geocode']);
    dropoffAutocomplete.setTypes(['geocode']);

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
            timeResult.textContent = ""; // Clear the time result if not valid
        }
    }

    function displayDistance(response, status) {
        if (status == 'OK') {
            const distance = response.rows[0].elements[0].distance.value / 1000; // distance in kilometers
            const duration = response.rows[0].elements[0].duration.text; // duration in human-readable format
            distanceResult.textContent = `Distance: ${distance} km`;
            timeResult.textContent = `Estimated Time: ${duration}`; // Display estimated time
        } else {
            distanceResult.textContent = "Unable to calculate distance.";
            timeResult.textContent = ""; // Clear time result if distance calculation fails
        }
    }

    pickupAutocomplete.addListener('place_changed', calculateDistance);
    dropoffAutocomplete.addListener('place_changed', calculateDistance);
});
// Define car prices
const carPrices = {
    "4 Seater": 200.00,   // Rs 200/hour
    "6 Seater": 500.00,   // Rs 500/hour
    "8 Seater": 700.00,   // Rs 700/hour
    "9 Seater": 900.00    // Rs 900/hour
};

// Variable to hold the selected car option
let selectedCar = null; 

// Event listener for when the car option is selected
document.querySelectorAll('.car-option').forEach(option => {
    option.addEventListener('click', function () {
        // Highlight the selected car option
        document.querySelectorAll('.car-option').forEach(car => car.classList.remove('selected'));
        this.classList.add('selected');

        // Set the selected car based on the option clicked
        selectedCar = this.querySelector('h3').textContent.split(':')[0].trim();
        calculatePrice(); // Call price calculation whenever a car option is selected
    });
});

function calculatePrice() {
    if (!selectedCar) {
        document.getElementById('estimated-price').textContent = "Select a car option";
        document.getElementById('book-now-btn').style.display = 'none'; // Hide the button if no car is selected
        return;
    }

    const duration = document.getElementById('time-result').textContent; // Format: "Estimated Time: X days : Y hours : Z minutes"
    const timeComponents = duration.match(/(\d+) days : (\d+) hours : (\d+) minutes/);

    let totalHours = 0;

    if (timeComponents) {
        const days = parseInt(timeComponents[1], 10);
        const hours = parseInt(timeComponents[2], 10);
        const minutes = parseInt(timeComponents[3], 10);

        // Convert total time into hours, including minutes
        totalHours = (days * 24) + hours + (minutes / 60); // Convert minutes to hours as a decimal
    }

    // Calculate total price
    const pricePerHour = carPrices[selectedCar] || 0;
    const totalPrice = totalHours * pricePerHour;

    // Display the total price with two decimal places
    document.getElementById('estimated-price').textContent = `Estimated Price: Rs ${totalPrice.toFixed(2)}`;

    // Show the "Book Now" button only if a valid price is calculated
    if (totalPrice > 0) {
        document.getElementById('book-now-btn').style.display = 'inline-block'; // Show the button
    } else {
        document.getElementById('book-now-btn').style.display = 'none'; // Hide the button if price is 0
    }
}

// Google Maps API code for distance and time calculation
document.addEventListener('DOMContentLoaded', function () {
    const pickupLocationInput = document.getElementById('pickup-location');
    const dropoffLocationInput = document.getElementById('dropoff-location');
    const distanceResult = document.getElementById('distance-result');
    const timeResult = document.getElementById('time-result');

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupLocationInput);
    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffLocationInput);
    pickupAutocomplete.setTypes(['geocode']);
    dropoffAutocomplete.setTypes(['geocode']);

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
            timeResult.textContent = ""; // Clear the time result if not valid
        }
    }

    function displayDistance(response, status) {
        if (status == 'OK') {
            const distance = response.rows[0].elements[0].distance.value / 1000; // distance in kilometers
            const durationValue = response.rows[0].elements[0].duration.value; // Duration in seconds

            distanceResult.textContent = `Distance: ${distance} km`;
            
            // Convert duration to days, hours, minutes
            const totalMinutes = Math.floor(durationValue / 60); // Duration in minutes
            const days = Math.floor(totalMinutes / 1440);
            const hours = Math.floor((totalMinutes % 1440) / 60);
            const minutes = totalMinutes % 60;

            timeResult.textContent = `Estimated Time: ${days} days : ${hours} hours : ${minutes} minutes`; // Display estimated time
            calculatePrice(); // Recalculate price when time is updated
        } else {
            distanceResult.textContent = "Unable to calculate distance.";
            timeResult.textContent = ""; // Clear time result if distance calculation fails
        }
    }

    pickupAutocomplete.addListener('place_changed', calculateDistance);
    dropoffAutocomplete.addListener('place_changed', calculateDistance);
});
