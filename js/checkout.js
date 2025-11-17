// checkout.js: Logic for loading the order summary and handling checkout form submission.

document.addEventListener('DOMContentLoaded', async () => {
    // Check dependencies
    if (typeof Utils === 'undefined' || typeof ProductsData === 'undefined') {
        console.error('Dependencies not loaded. Check script links in checkout.html.');
        return;
    }

    // Initialize data manager and load product details ONCE
    const dataManager = new ProductsData();
    await dataManager.loadProducts();
    const products = dataManager.products; // Store the full product list

    // Pass the loaded products to the rendering function
    renderOrderSummary(products);

    // Attach listener for the final form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmission);
    }
});

/** Retrieves enriched cart items (with product details) using the loaded product data */
function getEnrichedCart(products) {
    const cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    
    // Use the products passed from the main block
    return cart.map(item => {
        const productDetail = products.find(p => p.id === item.id);
        return productDetail ? { ...item, ...productDetail } : null;
    }).filter(item => item !== null); // Filter out items not found in product data
}

/** Renders the order summary and calculates the final total */
function renderOrderSummary(products) {
    const summaryContainer = document.getElementById('order-summary-details');
    const paymentButton = document.getElementById('initiate-payment-btn');
    
    const enrichedCart = getEnrichedCart(products); // Use the corrected function call
    
    // Fixed costs
    const SHIPPING_COST = 2500;
    const FREE_SHIPPING_THRESHOLD = 50000;
    let subtotal = 0;

    if (enrichedCart.length === 0) {
        summaryContainer.innerHTML = `<p style="text-align:center;">Your cart is empty. <a href="products.html">Start Shopping</a>.</p>`;
        if (paymentButton) paymentButton.disabled = true;
        return;
    }

    // --- 1. Calculate Subtotal and Render Item List ---
    const itemsHtml = enrichedCart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="summary-line">
                <span class="summary-item-title">${item.title} <span class="summary-item-qty">x${item.quantity}</span></span>
                <span class="summary-item-price">${Utils.formatPrice(itemTotal)}</span>
            </div>
        `;
    }).join('');

    // --- 2. Calculate Final Costs ---
    const finalShipping = (subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    const grandTotal = subtotal + finalShipping;

    // --- 3. Render Final Summary Box ---
    summaryContainer.innerHTML = `
        <div class="summary-items-list" style="margin-bottom: 20px;">
            ${itemsHtml}
        </div>
        
        <div class="summary-line">
            <span>Subtotal</span>
            <span>${Utils.formatPrice(subtotal)}</span>
        </div>
        <div class="summary-line">
            <span>Shipping</span>
            <span>${finalShipping === 0 ? 'FREE' : Utils.formatPrice(finalShipping)}</span>
        </div>
        
        ${subtotal >= FREE_SHIPPING_THRESHOLD ? `<div class="summary-line" style="color:var(--pink-deep); font-weight:600;">(Eligible for Free Shipping)</div>` : ''}

        <div class="summary-line total">
            <strong>Grand Total</strong>
            <strong id="final-total">${Utils.formatPrice(grandTotal)}</strong>
        </div>
    `;

    // --- 4. Update Payment Button ---
    if (paymentButton) {
        paymentButton.textContent = `Pay Now (${Utils.formatPrice(grandTotal)})`;
        paymentButton.disabled = false;
        // Store total amount on the button for easy access during payment initiation
        paymentButton.dataset.amount = grandTotal; 
    }
}


/** Handles the form submission, preparing the order object for API submission. */
function handleCheckoutSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const paymentButton = document.getElementById('initiate-payment-btn');
    
    // --- 1. Basic Validation ---
    if (!form.checkValidity()) {
        alert("Please fill out all required shipping and contact fields.");
        return;
    }

    paymentButton.disabled = true; // Prevent double submission

    const formData = new FormData(form);
    const shippingDetails = Object.fromEntries(formData.entries());
    const amount = paymentButton.dataset.amount;
    const cartItems = getEnrichedCart(dataManager.products); 

    // --- 2. CONSTRUCT THE COMPLETE ORDER OBJECT ---
    const orderDataForBackend = {
        orderId: 'ORD-' + Date.now(), 
        totalAmount: parseFloat(amount), // Ensure amount is a number
        currency: 'NGN', 
        customerDetails: {
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            firstName: shippingDetails['first-name'],
            lastName: shippingDetails['last-name'],
        },
        shippingAddress: {
            addressLine: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
        },
        items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtTimeOfOrder: item.price,
        })),
        date: new Date().toISOString(),
        paymentStatus: 'Pending' 
    };

    // --- 3. CRITICAL: BACKEND API SIMULATION ---
    
    // In a real application, you would use 'fetch' to POST this data to your backend API:
    /*
    fetch('/api/v1/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDataForBackend),
    })
    .then(response => response.json())
    .then(serverOrderResponse => {
        // Step 4: Initiate payment redirection using data from the server response
        // initiatePaymentGateway(serverOrderResponse.transactionId, ...);
    })
    .catch(error => {
        console.error('Error submitting order to backend:', error);
        paymentButton.disabled = false; // Re-enable button on failure
        alert('Could not submit order. Please try again.');
    });
    */

    // TEMPORARY FRONTEND LOGGING (Until backend is ready)
    console.log("Order Data Ready for Backend API (JSON):", JSON.stringify(orderDataForBackend, null, 2));

    if (typeof showCartFeedback !== 'undefined') {
        const finalAmount = amount || 0; 
        showCartFeedback(`Order data prepared. Ready to send to server and proceed to payment of ${Utils.formatPrice(finalAmount)}.`);
    }

    // You would typically redirect here after the API success response
    // setTimeout(() => { window.location.href = 'FLUTTERWAVE_INIT_LINK'; }, 1500); 
    
    paymentButton.disabled = false; // Re-enable for further testing without backend
}