// contact.js: Handles form submission for the Contact Us page, preparing data for API.

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

    if (!form.checkValidity()) {
        alert("Please fill out all required fields.");
        return;
    }

    submitButton.disabled = true;

    const formData = new FormData(form);
    const messageData = Object.fromEntries(formData.entries());

    // --- Data Structured for Backend ---
    const dataForAPI = {
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        timestamp: new Date().toISOString() // Server will typically handle this, but it's good for the client to send it
    };

    // --- TEMPORARY FRONTEND SIMULATION ---
    console.log("Contact Form Data Prepared (JSON):", JSON.stringify(dataForAPI, null, 2));

    if (typeof showCartFeedback !== 'undefined') {
        showCartFeedback("Thank you! Your message has been sent successfully.");
    } else {
        alert("Thank you! Your message has been sent successfully.");
    }
    
    // Clear the form after simulated success
    form.reset();
    
    // --- FUTURE BACKEND INTEGRATION POINT ---
    /* // In the future, you would uncomment this fetch block:
    fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataForAPI)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to submit message.');
        return response.json();
    })
    .then(data => {
        // Handle success response from backend
    })
    .catch(error => {
        console.error('Submission error:', error);
        alert('There was an error submitting your message. Please try again.');
    })
    .finally(() => {
        submitButton.disabled = false; // Re-enable button regardless of outcome
    });
    */
    
    // Re-enable button for testing purposes on the frontend
    submitButton.disabled = false; 
}