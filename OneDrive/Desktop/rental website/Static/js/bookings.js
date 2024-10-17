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
    // Array of input IDs to validate
    const inputIds = ["customer-name", "customer-middlename", "customer-lastname"];
    
    // Function to handle keydown events
    function validateInput(event) {
        const key = event.key;
        
        // Regular expression to allow only letters and spaces
        if (!/^[A-Za-z\s]$/.test(key) && key !== "Backspace" && key !== "Delete") {
            event.preventDefault();
        }
    }

    // Loop through each input ID and add the event listener
    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        inputElement.addEventListener("keydown", validateInput);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const numberInput = document.getElementById("customer-number");
    const errorMessage = document.getElementById("mobilenumber-error");
    const submitButton = document.getElementById('pay-button');

    // Initialize intl-tel-input plugin
    const iti = window.intlTelInput(numberInput, {
      initialCountry: "in", // Automatically detect country
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

document.addEventListener('DOMContentLoaded', function () {
    const payButton = document.getElementById('pay-button');
    const nameInput = document.getElementById('customer-name');
    const numberInput = document.getElementById('customer-number');
    const emailInput = document.getElementById('customer-email');
    const ageInput = document.getElementById('customer-age')

    const iti = window.intlTelInput(numberInput, {
        initialCountry: "in", // Automatically detect country
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    function checkInputs() {
        const nameFilled = nameInput.value.trim() !== '';
        const numberFilled = iti.isValidNumber();
        const emailFilled = emailInput.value.trim() !== '';
        const ageFilled = ageInput.value.trim() !== '';

        if (nameFilled && numberFilled && emailFilled && ageFilled) {
            payButton.disabled = false;  // Enable the button
        } else {
            payButton.disabled = true;   // Disable the button
        }
    }

    // Add event listeners to each input field
    [nameInput, numberInput, emailInput, ageInput].forEach(input => {
        input.addEventListener('input', checkInputs);
    });
});
document.getElementById('pay-button').onclick = function(e) {
    e.preventDefault();

    // Collect billing information
    const name = document.getElementById('customer-name').value;
    const contact = document.getElementById('customer-number').value;
    const email = document.getElementById('customer-email').value;
    const amountInRupees = document.getElementById('price-span').value;
    const amountInPaise = amountInRupees * 100; // Convert amount to paise

    var options = {
        "key": "rzp_test_PMMLte4CIjePoq", 
        "amount": amountInPaise, // Amount in paise
        "currency": "INR",
        "name": name, // Displayed in the Razorpay checkout
        "description": "Payment for Car Rental",
        "image": "https://media.istockphoto.com/id/1290071290/vector/rental-car-icon.jpg?s=612x612&w=0&k=20&c=q4EsvU3jJJYbcZTJ1EzKh6c-Dvy39HagvAUgTCRK9bE=", // Replace with your logo URL
        "handler": function (response) {
            // After payment, you can log the response
            alert("Payment successful!");
            alert("Payment ID: " + response.razorpay_payment_id);
            alert("Order ID: " + response.razorpay_order_id);
            alert("Signature: " + response.razorpay_signature);

            // Optionally, send billing information to your backend or save it
            console.log({
                name: name,
                contact: contact,
                email: email,
                amount: amountInRupees,
                paymentId: response.razorpay_payment_id
            });
        },
        "theme": {
            "color": "#F37254"
        }
    };

    // Open the Razorpay payment dialog
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
};
