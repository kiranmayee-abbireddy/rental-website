
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
    const numberInput = document.getElementById("mobilenumber");
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
            errorMessage.textContent = "Please enter exactly 10 digits."; // Set error message
            errorMessage.style.display = "block";
        } else {
            errorMessage.textContent = ""; 
            errorMessage.style.display = "none"; 
        }
    });
});
