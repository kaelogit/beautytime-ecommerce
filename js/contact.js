// contact.js: Handles form submission for the Contact Us page via Django API.

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
});

function handleContactSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // 1. Basic Validation
    if (!form.checkValidity()) {
        alert("Please fill out all required fields.");
        return;
    }

    // 2. Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // 3. Prepare Data
    const formData = new FormData(form);
    const messageData = Object.fromEntries(formData.entries());

    // Data structure matching the Django View expectation
    const dataForAPI = {
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message
    };

    // 4. Send to Backend
    // Ensure your Django server is running on this port
    const API_URL = 'http://127.0.0.1:8000/api/contact/';

    fetch(API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dataForAPI)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Success: Show feedback
            if (typeof showCartFeedback !== 'undefined') {
                showCartFeedback(data.message);
            } else {
                alert(data.message);
            }
            form.reset(); // Clear the form
        } else {
            // Server returned an error (e.g. invalid data)
            alert('Something went wrong: ' + data.message);
        }
    })
    .catch(error => {
        // Network or Server Error
        console.error('Submission error:', error);
        alert('There was an error submitting your message. Please ensure the server is running.');
    })
    .finally(() => {
        // 5. Cleanup: Re-enable button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false; 
    });
}