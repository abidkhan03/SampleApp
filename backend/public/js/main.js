// JavaScript to add 'active' class to the clicked link
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', function () {
            links.forEach(lnk => lnk.classList.remove('active')); // Remove 'active' class from all links
            this.classList.add('active'); // Add 'active' class to the clicked link
        });
    });
});
// Flash messages for 5 seconds to display
document.addEventListener('DOMContentLoaded', function () {
    // Handle flush errors
    let flashErrors = document.getElementById('flashErrors');
    if (flashErrors) {
        setTimeout(function () {
            flashErrors.style.display = 'none';
        }, 5000);
    }

    // Handle flash success messages
    let flashSuccess = document.getElementById('flashSuccess');
    if (flashSuccess) {
        setTimeout(function () {
            flashSuccess.style.display = 'none';
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    let fullName = '{{session.user.name}}';
    let firstName = fullName.split(' ')[0]; // Split the name by space and take the first part
    document.getElementById('logoutLink').innerHTML = 'Logout (' + firstName + ')';
});

$(document).ready(function () {
    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    $('#emailInput').on('input', function () {
        let email = $(this).val();
        if (!isValidEmail(email)) {
            $('#emailError').show();
        } else {
            $('#emailError').hide();
        }
    });

    $('#signupForm').on('submit', function (e) {
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let confirmPassword = $('#confirmPasswordInput').val();

        if (!isValidEmail(email)) {
            e.preventDefault(); // Prevent form submission
            $('#emailError').show();
        }

        if (password.length < 5) {
            e.preventDefault(); // Prevent form submission
            $('#passwordWarning').show();
        }

        if (confirmPassword <= 5) {
            e.preventDefault();
            $('#passwordWarning').show();
        }

        if (confirmPassword !== password) {
            e.preventDefault(); // Prevent form submission
            $('#passwordMismatch').show();
        }
    });

    $('#loginForm').on('submit', function (e) {
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();

        if (!isValidEmail(email)) {
            e.preventDefault(); // Prevent form submission
            $('#emailError').show();
        }

        if (password.length <= 5) {
            e.preventDefault(); // Prevent form submission
            $('#passwordWarning').show();
        }
    });
});