// product.js: Logic for the single product page
// Requires products-data.js, utils.js, and main.js (for addToCart/showCartFeedback) to be loaded.
document.addEventListener('DOMContentLoaded', async () => {
    // Check dependencies
    if (typeof ProductsData === 'undefined' || typeof Utils === 'undefined') {
        console.error('Dependencies not loaded. Check script links in product.html.');
        return;
    }

    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailContainer = document.getElementById('product-detail');

    if (!productId) {
        productDetailContainer.innerHTML = '<p class="error-message">Error: Product ID is missing from the URL.</p>';
        return;
    }

    // 2. Initialize Data Manager and find the product
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
    
    // 3. Initialize dynamic features after rendering
    initQuantityControls(productId);
    initGalleryLogic(product); // <-- NEW CALL
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
    
    // Determine the main image URL for rendering (uses the single 'image' field)
    const mainImageUrl = product.image; 

    // --- Generate Thumbnail HTML ---
    const galleryUrls = product.image_gallery || []; // Use the full gallery array from the API
    const thumbnailsHtml = galleryUrls.map((imgData, index) => `
        <div class="thumbnail ${imgData.is_main || index === 0 ? 'active' : ''}" data-image-url="${imgData.url}">
            <img src="${imgData.url}" alt="${product.title} thumbnail ${index + 1}">
        </div>
    `).join('');


    // Template for the single product view
    container.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img id="main-product-img" src="${mainImageUrl}" alt="${product.title}">
            </div>
            <div class="thumbnail-gallery" id="thumbnail-gallery-container">
                ${thumbnailsHtml}
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

// --- NEW FUNCTION: Gallery Logic ---
function initGalleryLogic(product) {
    const mainImageElement = document.getElementById('main-product-img');
    const thumbnailContainer = document.getElementById('thumbnail-gallery-container');
    
    if (!mainImageElement || !thumbnailContainer) return;

    thumbnailContainer.addEventListener('click', (e) => {
        const thumbnailDiv = e.target.closest('.thumbnail');
        if (!thumbnailDiv) return;

        const newImageUrl = thumbnailDiv.dataset.imageUrl;

        // 1. Update the main displayed image source
        mainImageElement.src = newImageUrl;

        // 2. Update active class on thumbnails
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnailDiv.classList.add('active');
    });
}
// --- END NEW FUNCTION ---


// Function to handle quantity and cart action
function initQuantityControls(productId) {
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const addToCartBtn = document.getElementById('add-to-cart-single');

    if (!qtyInput || !qtyMinus || !qtyPlus || !addToCartBtn) return; 

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
            for (let i = 0; i < quantity; i++) {
                if (typeof addToCart !== 'undefined') {
                    addToCart(productId);
                }
            }
        }
    });
}