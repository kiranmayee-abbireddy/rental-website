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
