// cart.js: Logic for loading, displaying, and managing the shopping cart page.

document.addEventListener('DOMContentLoaded', async () => {
    // Check dependencies
    if (typeof Utils === 'undefined' || typeof ProductsData === 'undefined') {
        console.error('Dependencies not loaded. Check script links in cart.html.');
        return;
    }

    // Initialize data manager to get product details
    const dataManager = new ProductsData();
    await dataManager.loadProducts();

    renderCart();

    // Attach listener for quantity changes and removal (delegation)
    document.getElementById('cart-items-container').addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.matches('.quantity-btn')) {
            const productId = target.closest('.cart-item').dataset.id;
            const action = target.dataset.action;
            updateCartItemQuantity(productId, action);
        } else if (target.matches('.remove-btn')) {
            const productId = target.closest('.cart-item').dataset.id;
            removeCartItem(productId);
        }
    });
});

/** Retrieves enriched cart items (with product details) */
function getEnrichedCart() {
    const cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    
    // Safety check for dependency access
    if (typeof ProductsData === 'undefined') return [];

    const dataManager = new ProductsData();
    // Assuming products are loaded synchronously by this point for efficiency
    if (dataManager.products.length === 0) {
        dataManager.loadProducts();
    }
    
    return cart.map(item => {
        const productDetail = dataManager.products.find(p => p.id === item.id);
        return productDetail ? { ...item, ...productDetail } : null;
    }).filter(item => item !== null); // Filter out items not found in product data
}

/** Renders the cart items and summary */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const summaryElement = document.querySelector('.cart-summary');
    
    const enrichedCart = getEnrichedCart();

    if (enrichedCart.length === 0) {
        cartItemsContainer.style.display = 'none';
        summaryElement.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        
        // Ensure global cart count is 0
        if (typeof Utils !== 'undefined') {
            Utils.updateCartCount();
        }
        return;
    }

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

    updateCartSummary(subtotal);
}

/** Updates the totals in the order summary box */
function updateCartSummary(subtotal) {
    const shippingCost = 2500; // Fixed shipping for now (₦2,500)
    const total = subtotal + shippingCost;
    const enrichedCart = getEnrichedCart();

    document.getElementById('cart-subtotal').textContent = Utils.formatPrice(subtotal);
    document.getElementById('shipping-cost').textContent = Utils.formatPrice(shippingCost);
    document.getElementById('cart-total').textContent = Utils.formatPrice(total);
    document.getElementById('item-count').textContent = enrichedCart.length;
}

/** Updates quantity and saves to localStorage */
function updateCartItemQuantity(productId, action) {
    let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        }
        
        localStorage.setItem('beautyTimesCart', JSON.stringify(cart));
        
        // Re-render the cart and update global count
        renderCart(); 
        if (typeof Utils !== 'undefined') {
            Utils.updateCartCount();
        }
    }
}

/** Removes an item completely from the cart */
function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    const updatedCart = cart.filter(item => item.id !== productId);

    localStorage.setItem('beautyTimesCart', JSON.stringify(updatedCart));
    
    // Re-render the cart and update global count
    renderCart();
    if (typeof Utils !== 'undefined') {
        Utils.updateCartCount();
    }
    
    // Provide user feedback
    if (typeof showCartFeedback !== 'undefined') {
        showCartFeedback('Item removed from cart.');
    }
}