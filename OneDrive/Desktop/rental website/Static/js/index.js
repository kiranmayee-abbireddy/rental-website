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
            errorMessage.textContent = "Please enter 10 digits.";
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
    
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('submit').addEventListener('click', function() {
            const fullNumber = getFullNumber();
            console.log("Full Number: ", fullNumber);
        });
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

// Immediately Invoked Function Expression (IIFE)
(function() {
    // Declare a global variable to store form data
    window.formData = {};

    // Event listener for the Book Now button
    document.getElementById("book-now-btn")?.addEventListener("click", function() {
        // Gather input values
        const pickupLocation = document.getElementById("pickup-location").value;
        const dropoffLocation = document.getElementById("dropoff-location").value;
        const pickupDate = document.getElementById("pickup-date").value;
        const pickupTime = document.getElementById("pickup-time").value;

        // Get selected car details
        const selectedCar = document.querySelector('.car-option.selected h3');
        const car = selectedCar ? selectedCar.textContent.split(':')[1].trim() : "0";

        // Get distance and time
        const distance = document.getElementById("distance-result").textContent;
        const time = document.getElementById("time-result").textContent;
        const price  = document.getElementById("estimated-price").textContent;

        // Store values in the global variable
        formData = {
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
            pickupDate: pickupDate,
            pickupTime: pickupTime,
            car: car,
            distance: distance,
            time: time,
            price: price
        };

        // Save the form data in local storage
        localStorage.setItem("formData", JSON.stringify(formData));

        // Redirect to bookings.html
        window.location.href = "../templates/bookings.html";
    });

    // Retrieve form data from local storage when on bookings.html
    if (window.location.pathname.endsWith("bookings.html")) {
        const storedFormData = JSON.parse(localStorage.getItem("formData"));

        // Check if formData exists
        if (storedFormData) {
            // Display the data in the corresponding spans
            document.getElementById("pickup-location-span").textContent = storedFormData.pickupLocation;
            document.getElementById("dropoff-location-span").textContent = storedFormData.dropoffLocation;
            document.getElementById("pickup-date-span").textContent = storedFormData.pickupDate;
            document.getElementById("pickup-time-span").textContent = storedFormData.pickupTime;
            document.getElementById("car-span").textContent = storedFormData.car;
            document.getElementById("distance-span").textContent = storedFormData.distance;
            document.getElementById("time-span").textContent = storedFormData.time;
            document.getElementById("price-span").textContent = storedFormData.price;
        } else {
            // Handle case where there is no form data
            console.log("No booking data found.");
        }
    }
})();
