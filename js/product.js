// product.js: Logic for the single product page
// Requires products-data.js, utils.js, and main.js (for addToCart/showCartFeedback) to be loaded.
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailContainer = document.getElementById('product-detail');

    if (!productId) {
        productDetailContainer.innerHTML = '<p class="error-message">Error: Product ID is missing from the URL.</p>';
        return;
    }

    // 2. Initialize Data Manager and find the product
    if (typeof ProductsData === 'undefined' || typeof Utils === 'undefined') {
        productDetailContainer.innerHTML = '<p class="error-message">Error: Core dependencies not loaded (ProductsData/Utils).</p>';
        return;
    }

    // Assuming ProductsData class is globally available
    const dataManager = new ProductsData();
    await dataManager.loadProducts();
    const product = dataManager.products.find(p => p.id === productId);

    if (!product) {
        productDetailContainer.innerHTML = `<p class="error-message">Error: Product with ID "${productId}" not found in our catalog.</p>`;
        return;
    }
    
    // Clear loading state and render details
    productDetailContainer.innerHTML = ''; 
    renderProductDetails(product, productDetailContainer);
    
    // Attach Quantity Selector and Cart Listeners
    initQuantityControls(productId);
});


function renderProductDetails(product, container) {
    // Calculate discount percentage
    const discountPercent = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : null;

    // Placeholder features (replace this with actual product data when available)
    const featuresHtml = [
        'Paraben-Free Formulation',
        'Dermatologist Tested',
        'Suitable for Sensitive Skin'
    ].map(f => `<div class="feature"><i class="fas fa-check-circle"></i><span>${f}</span></div>`).join('');


    // Template for the single product view
    container.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img id="main-product-img" src="${product.image}" alt="${product.title}">
            </div>
            <div class="thumbnail-gallery">
                <div class="thumbnail active"><img src="${product.image}" alt="${product.title} thumbnail"></div>
            </div>
        </div>

        <div class="product-info">
            <div class="breadcrumb">
                <a href="index.html">Home</a> / <a href="products.html?category=${product.category}">${product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</a> / <span>${product.title}</span>
            </div>

            <h1 class="product-title">${product.title}</h1>
            <p class="product-brand">By: <strong>${product.brand}</strong></p>

            <div class="product-rating">
                <div class="rating-stars">${Utils.generateStarRating(product.rating)}</div>
                <span class="rating-text">(${product.reviewCount} reviews)</span>
            </div>

            <div class="product-price">
                <span class="current-price">${Utils.formatPrice(product.price)}</span>
                ${product.originalPrice > product.price ? 
                    `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
                ${discountPercent ? `<span class="discount-badge">SAVE ${discountPercent}%</span>` : ''}
            </div>
            
            <div class="product-description">
                ${product.description || 'A luxurious skincare product designed to hydrate and rejuvenate the skin, leaving it soft and radiant.'}
            </div>

            <div class="product-features">
                ${featuresHtml}
            </div>

            <div class="quantity-selector">
                <span class="quantity-label">Quantity:</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" id="qty-minus"><i class="fas fa-minus"></i></button>
                    <input type="text" class="quantity-input" id="qty-input" value="1" min="1" inputmode="numeric">
                    <button class="quantity-btn" id="qty-plus"><i class="fas fa-plus"></i></button>
                </div>
            </div>

            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-single">Add to Cart</button>
            </div>
            
            <div class="product-meta">
                <div class="meta-item"><span class="meta-label">SKU:</span><span class="meta-value">${product.id.toUpperCase()}</span></div>
                <div class="meta-item"><span class="meta-label">Category:</span><span class="meta-value">${product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span></div>
            </div>
        </div>
    `;
}

// Function to handle quantity and cart action
function initQuantityControls(productId) {
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const addToCartBtn = document.getElementById('add-to-cart-single');

    if (!qtyInput || !qtyMinus || !qtyPlus || !addToCartBtn) return; // Safety check

    qtyMinus.addEventListener('click', () => {
        let currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    });

    qtyPlus.addEventListener('click', () => {
        let currentQty = parseInt(qtyInput.value);
        qtyInput.value = currentQty + 1;
    });

    qtyInput.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1) {
            qtyInput.value = 1;
        }
    });
    
    // Add to cart listener uses the global addToCart function from main.js
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        if (quantity >= 1) {
            // Call global addToCart function once for each quantity
            for (let i = 0; i < quantity; i++) {
                if (typeof addToCart !== 'undefined') {
                    addToCart(productId);
                }
            }
        }
    });
}