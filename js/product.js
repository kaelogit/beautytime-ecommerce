/**
 * Product Detail Page Functionality
 * This ONE file handles ALL products dynamically!
 */

class ProductDetail {
    constructor() {
        this.product = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.init();
    }

    async init() {
        console.log('🔄 Initializing product detail page...');
        
        // Get product ID from URL
        const productId = this.getProductIdFromURL();
        
        if (!productId) {
            this.showError('Product not found');
            return;
        }

        // Load and display the product
        await this.loadProduct(productId);
        this.renderProduct();
        this.setupEventListeners();
        
        console.log('✅ Product detail page ready');
    }

    // Get product ID from URL parameters
    getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Load product data - in real app, this would be an API call
    async loadProduct(productId) {
        // For now, we'll use sample data
        // In real app, you'd fetch from an API or use your products data
        const sampleProducts = {
            'p001': {
                id: 'p001',
                title: 'Hydrating Face Cream with Hyaluronic Acid',
                brand: 'SkinEssentials',
                price: 8500,
                originalPrice: 10000,
                category: 'face-cream',
                images: [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBSRUdJTUVOVFM8L3RleHQ+Cjwvc3ZnPg==',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTc4ZWIyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SU1BR0UgMjwvdGV4dD4KPC9zdmc+',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDRhMzczIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SU1BR0UgMzwvdGV4dD4KPC9zdmc+'
                ],
                rating: 4.5,
                reviewCount: 128,
                description: 'Our premium hydrating face cream is formulated with hyaluronic acid to provide intense moisture and improve skin elasticity. Perfect for all skin types, this cream absorbs quickly without leaving a greasy residue.',
                features: [
                    'Deeply hydrates for 24 hours',
                    'Improves skin elasticity',
                    'Suitable for all skin types',
                    'Non-greasy formula',
                    'Cruelty-free and vegan'
                ],
                ingredients: 'Aqua, Hyaluronic Acid, Glycerin, Shea Butter, Jojoba Oil, Vitamin E, Aloe Vera',
                usage: 'Apply to clean face and neck every morning and evening. Gently massage in upward circular motions.',
                inStock: true,
                sku: 'BT-FC-001',
                category: 'Face Creams'
            },
            'p002': {
                id: 'p002',
                title: 'Vitamin C Brightening Serum',
                brand: 'RadiantGlow',
                price: 12000,
                originalPrice: 12000,
                category: 'face-serum',
                images: [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0VOVU0gUFJPRFVDVDwvdGV4dD4KPC9zdmc+'
                ],
                rating: 4.8,
                reviewCount: 95,
                description: 'Brighten and even out your skin tone with our potent Vitamin C serum. Formulated to reduce dark spots and improve skin radiance.',
                features: [
                    'Reduces dark spots and hyperpigmentation',
                    'Improves skin radiance',
                    'Antioxidant protection',
                    'Lightweight and fast-absorbing',
                    'Suitable for sensitive skin'
                ],
                ingredients: 'Vitamin C, Ferulic Acid, Vitamin E, Hyaluronic Acid, Green Tea Extract',
                usage: 'Apply 2-3 drops to clean face before moisturizer. Use daily for best results.',
                inStock: true,
                sku: 'BT-VC-002',
                category: 'Face Serums'
            }
            // ADD MORE PRODUCTS HERE - NO NEED FOR SEPARATE FILES!
        };

        this.product = sampleProducts[productId];
        
        if (!this.product) {
            this.showError('Product not found');
            return;
        }
    }

    // Render the product details
    renderProduct() {
        const container = document.getElementById('product-detail');
        if (!container || !this.product) return;

        const discount = this.product.originalPrice > this.product.price 
            ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
            : 0;

        container.innerHTML = `
            <div class="product-detail-content">
                <!-- Product Images -->
                <div class="product-images">
                    <div class="main-image">
                        <img src="${this.product.images[this.currentImageIndex]}" alt="${this.product.title}" id="main-product-image">
                    </div>
                    <div class="thumbnail-gallery">
                        ${this.product.images.map((image, index) => `
                            <div class="thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                                 onclick="productDetail.changeImage(${index})">
                                <img src="${image}" alt="${this.product.title} - Image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <h1 class="product-title">${this.product.title}</h1>
                    <p class="product-brand">by ${this.product.brand}</p>
                    
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStarRating(this.product.rating)}
                        </div>
                        <span class="rating-text">${this.product.rating} (${this.product.reviewCount} reviews)</span>
                    </div>

                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(this.product.price)}</span>
                        ${this.product.originalPrice > this.product.price ? `
                            <span class="original-price">${this.formatPrice(this.product.originalPrice)}</span>
                            <span class="discount-badge">-${discount}%</span>
                        ` : ''}
                    </div>

                    <p class="product-description">${this.product.description}</p>

                    <div class="product-features">
                        ${this.product.features.map(feature => `
                            <div class="feature">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="quantity-selector">
                        <span class="quantity-label">Quantity:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="productDetail.decreaseQuantity()">-</button>
                            <input type="number" class="quantity-input" value="${this.quantity}" min="1" max="10" readonly>
                            <button class="quantity-btn" onclick="productDetail.increaseQuantity()">+</button>
                        </div>
                    </div>

                    <div class="product-actions">
                        <button class="add-to-cart-btn btn btn-primary" onclick="productDetail.addToCart()" ${!this.product.inStock ? 'disabled' : ''}>
                            ${!this.product.inStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="wishlist-btn" onclick="productDetail.toggleWishlist()">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>

                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">SKU:</span>
                            <span class="meta-value">${this.product.sku}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Category:</span>
                            <span class="meta-value">${this.product.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Availability:</span>
                            <span class="meta-value" style="color: ${this.product.inStock ? 'green' : 'red'}">
                                ${this.product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Update breadcrumb
        const categoryElement = document.getElementById('product-category');
        if (categoryElement) {
            categoryElement.textContent = this.product.category;
        }

        // Update page title
        document.title = `${this.product.title} - Beauty Times`;
    }

    // Image gallery functionality
    changeImage(index) {
        this.currentImageIndex = index;
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = this.product.images[index];
        }
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Quantity controls
    increaseQuantity() {
        if (this.quantity < 10) {
            this.quantity++;
            this.updateQuantityDisplay();
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
            this.updateQuantityDisplay();
        }
    }

    updateQuantityDisplay() {
        const quantityInput = document.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }
    }

    // Add to cart
    addToCart() {
        if (!this.product.inStock) return;

        let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
        const existingItem = cart.find(item => item.id === this.product.id);

        if (existingItem) {
            existingItem.quantity += this.quantity;
        } else {
            cart.push({
                id: this.product.id,
                quantity: this.quantity,
                addedAt: new Date().toISOString(),
                product: this.product // Store product info for display
            });
        }

        localStorage.setItem('beautyTimesCart', JSON.stringify(cart));
        updateCartCount();
        showCartFeedback(`${this.quantity} ${this.product.title} added to cart!`);
        
        // Reset quantity
        this.quantity = 1;
        this.updateQuantityDisplay();
    }

    // Wishlist functionality
    toggleWishlist() {
        let wishlist = JSON.parse(localStorage.getItem('beautyTimesWishlist')) || [];
        const index = wishlist.indexOf(this.product.id);

        if (index > -1) {
            wishlist.splice(index, 1);
            showCartFeedback('Removed from wishlist');
        } else {
            wishlist.push(this.product.id);
            showCartFeedback('Added to wishlist');
        }

        localStorage.setItem('beautyTimesWishlist', JSON.stringify(wishlist));
        this.updateWishlistButton();
    }

    updateWishlistButton() {
        const wishlistBtn = document.querySelector('.wishlist-btn');
        const icon = wishlistBtn?.querySelector('i');
        const wishlist = JSON.parse(localStorage.getItem('beautyTimesWishlist')) || [];
        
        if (wishlistBtn && icon) {
            const isInWishlist = wishlist.includes(this.product.id);
            wishlistBtn.classList.toggle('active', isInWishlist);
            icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        }
    }

    setupEventListeners() {
        // Additional event listeners can be added here
        this.updateWishlistButton();
    }

    // Utility functions
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price);
    }

    showError(message) {
        const container = document.getElementById('product-detail');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${message}</h3>
                    <a href="products.html" class="btn btn-primary">Back to Products</a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
let productDetail;
document.addEventListener('DOMContentLoaded', function() {
    productDetail = new ProductDetail();
});