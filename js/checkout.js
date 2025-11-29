// checkout.js: Logic for loading the order summary and handling checkout form submission.

// Global variable to hold loaded products for access across functions
let loadedProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check dependencies
    if (typeof Utils === 'undefined' || typeof ProductsData === 'undefined') {
        console.error('Dependencies not loaded. Check script links in checkout.html.');
        return;
    }

    // Initialize data manager and load product details ONCE
    const dataManager = new ProductsData();
    await dataManager.loadProducts();
    loadedProducts = dataManager.products; // Store globally for the submission handler

    // Pass the loaded products to the rendering function
    renderOrderSummary(loadedProducts);

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
        // String conversion ensures ID matching works (1 vs "1")
        const productDetail = products.find(p => String(p.id) === String(item.id));
        return productDetail ? { ...item, ...productDetail } : null;
    }).filter(item => item !== null); 
}

/** Renders the order summary and calculates the final total */
function renderOrderSummary(products) {
    const summaryContainer = document.getElementById('order-summary-details');
    const paymentButton = document.getElementById('initiate-payment-btn');
    
    const enrichedCart = getEnrichedCart(products); 
    
    // Fixed costs
    const SHIPPING_COST = 5000; // Updated to 5000
    const FREE_SHIPPING_THRESHOLD = 90000;
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
        paymentButton.dataset.amount = grandTotal; 
    }
}


/** Handles the form submission */
/** Handles the form submission and triggers Paystack */
function handleCheckoutSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const paymentButton = document.getElementById('initiate-payment-btn');
    
    if (!form.checkValidity()) {
        alert("Please fill out all required shipping and contact fields.");
        return;
    }

    paymentButton.disabled = true; 
    paymentButton.textContent = "Processing Order...";

    const formData = new FormData(form);
    const shippingDetails = Object.fromEntries(formData.entries());
    const amount = paymentButton.dataset.amount;
    const cartItems = getEnrichedCart(loadedProducts); 

    // 1. Prepare Order Data
    const orderDataForBackend = {
        total_amount: parseFloat(amount),
        customer: {
            first_name: shippingDetails['first-name'],
            last_name: shippingDetails['last-name'],
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
        },
        items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }))
    };

    // 2. Create Order in Django (Status: Pending)
    fetch('https://beautytimes-backend.onrender.com/api/create-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDataForBackend),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const orderId = data.order_id;
            
            // 3. Open Paystack Popup
            const handler = PaystackPop.setup({
                key: 'pk_test_fed9bf23a9bf19fe8d89f9c56d0d84f56eb77ded', // <--- PASTE YOUR KEY HERE
                email: shippingDetails.email,
                amount: amount * 100, // Convert to kobo
                currency: 'NGN',
                ref: 'ORD-' + orderId + '-' + Date.now(),
                
                // Payment Successful!
                callback: function(response) {
                    // 4. Tell Backend to Update Status to "Paid"
                    fetch('https://beautytimes-backend.onrender.com/api/update-payment/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            order_id: orderId,
                            reference: response.reference 
                        })
                    }).then(() => {
                        // 5. Final Cleanup & Redirect
                        localStorage.removeItem('beautyTimesCart');
                        window.location.href = 'success.html'; // Create this page next!
                    });
                },
                onClose: function() {
                    alert('Transaction was not completed.');
                    paymentButton.disabled = false;
                    paymentButton.textContent = `Pay Now (${Utils.formatPrice(amount)})`;
                }
            });
            handler.openIframe();

        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        paymentButton.disabled = false;
        paymentButton.textContent = 'Try Again';
        alert('Could not initialize payment. Please try again.');
    }); 
}

    // --- 3. SEND TO BACKEND API ---
    // Note: We need to create this API endpoint in Django next!
    const API_URL = 'https://beautytimes-backend.onrender.com/api/create-order/';

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDataForBackend),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Order created successfully!
            if (typeof showCartFeedback !== 'undefined') {
                showCartFeedback(`Order #${data.order_id} Created! Proceeding to payment...`);
            }
            
            // HERE IS WHERE YOU WOULD INTEGRATE PAYSTACK POPUP
            alert(`Order Successful! Order ID: ${data.order_id}. In a real app, Paystack opens now.`);
            
            // Clear cart and redirect
            localStorage.removeItem('beautyTimesCart');
            window.location.href = 'index.html'; 
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error submitting order:', error);
        paymentButton.disabled = false;
        paymentButton.textContent = `Pay Now (${Utils.formatPrice(amount)})`;
        alert('Could not create order. Please try again.');
    }); 