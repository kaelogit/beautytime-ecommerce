// cart.js: Logic for loading, displaying, and managing the shopping cart page.

document.addEventListener('DOMContentLoaded', async () => {
    // Check dependencies
    if (typeof Utils === 'undefined' || typeof ProductsData === 'undefined') {
        console.error('Dependencies not loaded. Check script links in cart.html.');
        return;
    }

    // Initialize data manager to get product details
    const dataManager = new ProductsData();
    try {
        await dataManager.loadProducts();
    } catch (error) {
        console.error("Error loading products for cart:", error);
    }

    // Pass the loaded products to the render function
    renderCart(dataManager.products);

    // Attach listener for quantity changes and removal (delegation)
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (e) => {
            const target = e.target;
            
            // Handle clicks on buttons or icons inside buttons
            const quantityBtn = target.closest('.quantity-btn');
            const removeBtn = target.closest('.remove-btn');

            if (quantityBtn) {
                const productId = quantityBtn.closest('.cart-item').dataset.id;
                const action = quantityBtn.dataset.action;
                updateCartItemQuantity(productId, action, dataManager.products);
            } else if (removeBtn) {
                const productId = removeBtn.closest('.cart-item').dataset.id;
                removeCartItem(productId, dataManager.products);
            }
        });
    }
});

/** Retrieves enriched cart items using the loaded product list */
function getEnrichedCart(products) {
    const cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    
    // Safety check
    if (!products || products.length === 0) return [];

    return cart.map(item => {
        // CRITICAL FIX: Convert both IDs to String to ensure "1" matches 1
        const productDetail = products.find(p => String(p.id) === String(item.id));
        return productDetail ? { ...item, ...productDetail } : null;
    }).filter(item => item !== null); 
}

/** Renders the cart items and summary */
function renderCart(products) {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const summaryElement = document.querySelector('.cart-summary');
    
    const enrichedCart = getEnrichedCart(products);

    // Toggle Empty State vs List
    if (enrichedCart.length === 0) {
        cartItemsContainer.style.display = 'none'; // Hides "Loading..."
        summaryElement.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        
        if (typeof Utils !== 'undefined') {
            Utils.updateCartCount();
        }
        return;
    }

    // Show Cart State
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    summaryElement.style.display = 'block';

    let subtotal = 0;

    cartItemsContainer.innerHTML = enrichedCart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-item-brand">${item.brand}</p>
                    <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease"><i class="fas fa-minus"></i></button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                        <button class="quantity-btn" data-action="increase"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="remove-btn" title="Remove Item"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;
    }).join('');

    updateCartSummary(subtotal, enrichedCart.length);
}

/** Updates the totals in the order summary box */
function updateCartSummary(subtotal, count) {
    const shippingCost = 4000; 
    const total = subtotal + shippingCost;

    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('shipping-cost');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('item-count');

    if (subtotalEl) subtotalEl.textContent = Utils.formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = Utils.formatPrice(shippingCost);
    if (totalEl) totalEl.textContent = Utils.formatPrice(total);
    if (countEl) countEl.textContent = count;
}

/** Updates quantity and saves to localStorage */
function updateCartItemQuantity(productId, action, products) {
    let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    // Convert ID to string for finding index
    const itemIndex = cart.findIndex(item => String(item.id) === String(productId));

    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        }
        
        localStorage.setItem('beautyTimesCart', JSON.stringify(cart));
        
        // Re-render
        renderCart(products); 
        if (typeof Utils !== 'undefined') {
            Utils.updateCartCount();
        }
    }
}

/** Removes an item completely from the cart */
function removeCartItem(productId, products) {
    let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    // Filter by converting IDs to strings
    const updatedCart = cart.filter(item => String(item.id) !== String(productId));

    localStorage.setItem('beautyTimesCart', JSON.stringify(updatedCart));
    
    // Re-render
    renderCart(products);
    if (typeof Utils !== 'undefined') {
        Utils.updateCartCount();
    }
    
    if (typeof showCartFeedback !== 'undefined') {
        showCartFeedback('Item removed from cart.');
    }
}