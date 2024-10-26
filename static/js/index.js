const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
const yyyy = today.getFullYear();

const formattedDate = yyyy + '-' + mm + '-' + dd;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pickup-date').setAttribute('min', formattedDate);
});

document.addEventListener("DOMContentLoaded", function() {
    const nameInput = document.getElementById("name");

    nameInput.addEventListener("keydown", function(event) {
        const key = event.key;
        if (!/^[A-Za-z\s]$/.test(key) && key !== "Backspace" && key !== "Delete") {
            event.preventDefault();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const numberInput = document.getElementById("mobile");
    const errorMessage = document.getElementById("mobilenumber-error");
    const submitButton = document.getElementById('submit');

    // Initialize intl-tel-input plugin
    const iti = window.intlTelInput(numberInput, {
      initialCountry: "auto", // Automatically detect country
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Validate on keypress to ensure only digits
    numberInput.addEventListener("keydown", function(event) {
      const key = event.key;
      if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Delete" &&
          key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab") {
        event.preventDefault();
      }

      // Prevent entering more than 10 digits
      if (numberInput.value.length >= 10 && key !== "Backspace" &&
          key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab") {
        event.preventDefault();
      }
    });

    // Validate on blur to ensure correct length
    numberInput.addEventListener("blur", function() {
      const value = numberInput.value;
      if (value.length < 10) {
        errorMessage.textContent = "Please enter 10 digits.";
        errorMessage.style.display = "block";
      } else {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
      }
    });

    // Handle form submission
    submitButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent form submission for demo purposes

      // Get full number including the country code from the plugin
      if (iti.isValidNumber()) {
        const fullNumber = iti.getNumber(); // Get the full international number
        console.log("Full Number: ", fullNumber);
      } else {
        errorMessage.textContent = "Please enter a valid mobile number.";
        errorMessage.style.display = "block";
      }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const pickupLocationInput = document.getElementById('pickup-location');
    const autocomplete = new google.maps.places.Autocomplete(pickupLocationInput);
    autocomplete.setTypes(['geocode']);

    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
        } else {
            console.log("Place details:", place);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const viewVehiclesButton = document.getElementById('view-vehicles');
    const carOptions = document.getElementById('car-options');

    viewVehiclesButton.addEventListener('click', function () {
        if (carOptions.style.display === 'none' || carOptions.style.display === '') {
            carOptions.style.display = 'flex';
        } else {
            carOptions.style.display = 'none';
        }
    });
});

// Distance and Time Calculation
document.addEventListener('DOMContentLoaded', function() {
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
            distanceResult.textContent = "";
            timeResult.textContent = "";
        }
    }

    function displayDistance(response, status) {
        if (status == 'OK') {
            const distance = response.rows[0].elements[0].distance.value / 1000;
            const durationValue = response.rows[0].elements[0].duration.value;
            
            distanceResult.textContent = `Distance: ${distance} km`;
            const totalMinutes = Math.floor(durationValue / 60);
            const days = Math.floor(totalMinutes / 1440);
            const hours = Math.floor((totalMinutes % 1440) / 60);
            const minutes = totalMinutes % 60;
            timeResult.textContent = `Time: ${days} days : ${hours} hours : ${minutes} minutes`;

            calculatePrice(); 
        } else {
            distanceResult.textContent = "Unable to calculate distance.";
            timeResult.textContent = "";
        }
    }

    pickupAutocomplete.addListener('place_changed', calculateDistance);
    dropoffAutocomplete.addListener('place_changed', calculateDistance);
});

// Price Calculation
const carPrices = {
    "4 Seater": 200.00,
    "6 Seater": 500.00,
    "8 Seater": 700.00,
    "9 Seater": 900.00
};

let selectedCar = null; 

document.querySelectorAll('.car-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.car-option').forEach(car => car.classList.remove('selected'));
        this.classList.add('selected');
        selectedCar = this.querySelector('h3').textContent.split(':')[0].trim();
        calculatePrice();
    });
});

function calculatePrice() {
    if (!selectedCar) {
        document.getElementById('estimated-price').textContent = "Select a car option";
        document.getElementById('book-now-btn').style.display = 'none';
        return;
    }

    const duration = document.getElementById('time-result').textContent;
    const timeComponents = duration.match(/(\d+) days : (\d+) hours : (\d+) minutes/);

    let totalHours = 0;

    if (timeComponents) {
        const days = parseInt(timeComponents[1], 10);
        const hours = parseInt(timeComponents[2], 10);
        const minutes = parseInt(timeComponents[3], 10);

        totalHours = (days * 24) + hours + (minutes / 60);
    }

    const pricePerHour = carPrices[selectedCar] || 0;
    const totalPrice = totalHours * pricePerHour;

    document.getElementById('estimated-price').textContent = `Price: Rs ${totalPrice.toFixed(2)}`;

    if (totalPrice > 0) {
        document.getElementById('book-now-btn').style.display = 'inline-block';
    } else {
        document.getElementById('book-now-btn').style.display = 'none';
    }
}

document.querySelector("#book-now-btn").addEventListener("click", function(event) {
    // Prevent the default anchor behavior
    event.preventDefault();

    // Gather input values
    const pickupLocation = encodeURIComponent(document.getElementById("pickup-location").value);
    const dropoffLocation = encodeURIComponent(document.getElementById("dropoff-location").value);
    const pickupDate = encodeURIComponent(document.getElementById("pickup-date").value);
    const pickupTime = encodeURIComponent(document.getElementById("pickup-time").value);

    // Get selected car details
    const selectedCar = document.querySelector('.car-option.selected h3');
    const car = selectedCar ? encodeURIComponent(selectedCar.textContent.split(':')[1].trim()) : "No car selected";

    // Get distance and time
    const distance = encodeURIComponent(document.getElementById("distance-result").textContent) || "N/A";
    const time = encodeURIComponent(document.getElementById("time-result").textContent) || "N/A";
    const price = encodeURIComponent(document.getElementById("estimated-price").textContent) || "0";

    // Construct the query parameters
    const params = new URLSearchParams({
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        car,
        distance,
        time,
        price
    });

    // Redirect to bookings.html with encoded query parameters
    window.location.href = `../templates/bookings.html?${params.toString()}`;
});
