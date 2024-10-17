// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        pickupLocation: decodeURIComponent(params.get('pickupLocation')),
        dropoffLocation: decodeURIComponent(params.get('dropoffLocation')),
        pickupDate: decodeURIComponent(params.get('pickupDate')),
        pickupTime: decodeURIComponent(params.get('pickupTime')),
        car: decodeURIComponent(params.get('car')),
        distance: decodeURIComponent(params.get('distance')),
        time: decodeURIComponent(params.get('time')),
        price: decodeURIComponent(params.get('price'))
    };
}

// Display booking details
function displayBookingDetails() {
    const bookingDetails = getUrlParams();
    
    document.getElementById('pickup-location-span').textContent = bookingDetails.pickupLocation || 'N/A';
    document.getElementById('dropoff-location-span').textContent = bookingDetails.dropoffLocation || 'N/A';
    document.getElementById('pickup-date-span').textContent = bookingDetails.pickupDate || 'N/A';
    document.getElementById('pickup-time-span').textContent = bookingDetails.pickupTime || 'N/A';
    document.getElementById('car-span').textContent = bookingDetails.car || 'N/A';
    document.getElementById('distance-span').textContent = bookingDetails.distance || 'N/A';
    document.getElementById('time-span').textContent = bookingDetails.time || 'N/A';
    document.getElementById('price-span').textContent = bookingDetails.price || 'N/A';
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', displayBookingDetails);

document.addEventListener("DOMContentLoaded", function() {
    const nameInput = document.getElementById("customer-name");

    nameInput.addEventListener("keydown", function(event) {
        const key = event.key;
        if (!/^[A-Za-z\s]$/.test(key) && key !== "Backspace" && key !== "Delete") {
            event.preventDefault();
        }
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const numberInput = document.getElementById("customer-number");
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
document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');
    const nameInput = document.getElementById('customer-name');
    const numberInput = document.getElementById('customer-number');
    const emailInput = document.getElementById('customer-email');

    function checkInputs() {
        const nameFilled = nameInput.value.trim() !== '';
        const numberFilled = numberInput.value.trim() !== '';
        const emailFilled = emailInput.value.trim() !== '';

        if (nameFilled && numberFilled && emailFilled) {
            payButton.disabled = false;  // Enable the button
        } else {
            payButton.disabled = true;   // Disable the button
        }
    }

    // Add event listeners to each input field
    [nameInput, numberInput, emailInput].forEach(input => {
        input.addEventListener('input', checkInputs);
    });
});
