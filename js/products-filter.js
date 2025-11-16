// Simple Products Filter - Debug Version
console.log('Products filter script loaded');

class ProductsFilter {
    constructor() {
        console.log('ProductsFilter constructor called');
        this.productsData = new ProductsData();
        this.init();
    }

    async init() {
        console.log('Starting initialization...');
        await this.productsData.loadProducts();
        console.log('Products loaded:', this.productsData.products.length);
        this.productsData.applyFilters();
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsCount();
        console.log('Initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        // Basic event listeners for now
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.productsData.setSort(e.target.value);
                this.renderProducts();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                const view = e.target.closest('.view-btn').dataset.view;
                this.productsData.setView(view);
                this.renderProducts();
            });
        });
    }

    renderProducts() {
        console.log('Rendering products...');
        const grid = document.getElementById('products-grid');
        const loading = document.getElementById('loading-state');
        const noResults = document.getElementById('no-results');

        if (!grid) {
            console.error('Products grid element not found!');
            return;
        }

        // Hide loading immediately
        if (loading) loading.style.display = 'none';
        
        try {
            const products = this.productsData.getCurrentPageProducts();
            console.log('Products to render:', products.length);
            
            if (products.length === 0) {
                if (noResults) noResults.style.display = 'flex';
                grid.style.display = 'none';
                console.log('No products to display');
            } else {
                grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
                grid.style.display = 'grid';
                if (noResults) noResults.style.display = 'none';
                console.log('Products rendered successfully');

                // Apply view mode
                if (this.productsData.currentView === 'list') {
                    grid.classList.add('list-view');
                } else {
                    grid.classList.remove('list-view');
                }
            }
        } catch (error) {
            console.error('Error rendering products:', error);
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>Error loading products</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Reload Page</button>
                </div>
            `;
            grid.style.display = 'grid';
        }
    }

// In products-simple.js - Update the createProductCard function
    createProductCard(product) {
        const discount = product.originalPrice > product.price 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
                    ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                    ${!product.inStock ? '<span class="product-badge out-of-stock">Out of Stock</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-brand">${product.brand}</p>
                    
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStarRating(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>

                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price 
                            ? `<span class="original-price">${this.formatPrice(product.originalPrice)}</span>`
                            : ''
                        }
                    </div>

                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                            ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        
                        <!-- ADD THIS LINE - View Details Button -->
                        <a href="product.html?id=${product.id}" class="view-details-btn">View Details</a>
                        
                        <button class="wishlist-btn" onclick="toggleWishlist('${product.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

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

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        const totalProducts = document.getElementById('total-products');
        
        if (resultsCount && totalProducts) {
            resultsCount.textContent = this.productsData.filteredProducts.length;
            totalProducts.textContent = this.productsData.products.length;
        }
    }
}

// Simple Products Data
class ProductsData {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentSort = 'featured';
        this.currentView = 'grid';
    }

    async loadProducts() {
        console.log('Loading products data...');
        // Simple product data - guaranteed to work
        this.products = [
            {
                id: 'p001',
                title: 'Hydrating Face Cream',
                brand: 'SkinEssentials',
                price: 8500,
                originalPrice: 10000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBSRUdJTUVOVFM8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-cream',
                rating: 4.5,
                reviewCount: 128,
                isNew: true,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p002',
                title: 'Vitamin C Serum',
                brand: 'RadiantGlow',
                price: 12000,
                originalPrice: 12000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0VOVU0gUFJPRFVDVDwvdGV4dD4KPC9zdmc+',
                category: 'face-serum',
                rating: 4.8,
                reviewCount: 95,
                isNew: true,
                isBestseller: false,
                inStock: true
            },
            {
                id: 'p003',
                title: 'Clay Detox Mask',
                brand: 'PureSkin',
                price: 6500,
                originalPrice: 8000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBNQVNLUzwvdGV4dD4KPC9zdmc+',
                category: 'face-masks',
                rating: 4.3,
                reviewCount: 67,
                isNew: false,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p004',
                title: 'Body Butter',
                brand: 'BodyLuxe',
                price: 7200,
                originalPrice: 7200,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qk9EWSBDQVJFPC90ZXh0Pgo8L3N2Zz4=',
                category: 'body-care',
                rating: 4.6,
                reviewCount: 89,
                isNew: true,
                isBestseller: false,
                inStock: true
            },
            {
                id: 'p005',
                title: 'Face Scrub',
                brand: 'SoftTouch',
                price: 5500,
                originalPrice: 6500,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBTQ1JVQlM8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-scrubs',
                rating: 4.4,
                reviewCount: 112,
                isNew: false,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p006',
                title: 'Floral Perfume',
                brand: 'ScentEssence',
                price: 15000,
                originalPrice: 18000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RlJBR1JBTkNFPC90ZXh0Pgo8L3N2Zz4=',
                category: 'fragrance',
                rating: 4.7,
                reviewCount: 203,
                isNew: true,
                isBestseller: false,
                inStock: true
            }
        ];

        // Add more products for testing
        for (let i = 7; i <= 24; i++) {
            this.products.push({
                ...this.products[(i - 1) % 6],
                id: `p${i.toString().padStart(3, '0')}`,
                title: `${this.products[(i - 1) % 6].title} ${i}`,
                price: this.products[(i - 1) % 6].price + Math.floor(Math.random() * 2000),
                rating: 4 + Math.random(),
                reviewCount: Math.floor(Math.random() * 200) + 50
            });
        }
        
        console.log('Total products loaded:', this.products.length);
    }

    applyFilters() {
        this.filteredProducts = [...this.products];
        this.sortProducts();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => {
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return 0;
                });
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'bestselling':
                this.filteredProducts.sort((a, b) => {
                    if (a.isBestseller && !b.isBestseller) return -1;
                    if (!a.isBestseller && b.isBestseller) return 1;
                    return b.reviewCount - a.reviewCount;
                });
                break;
            default: // featured
                this.filteredProducts.sort((a, b) => {
                    if (a.isBestseller && !b.isBestseller) return -1;
                    if (!a.isBestseller && b.isBestseller) return 1;
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return b.rating - a.rating;
                });
        }
    }

    getCurrentPageProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
    }

    setSort(sortType) {
        this.currentSort = sortType;
        this.sortProducts();
    }

    setView(viewType) {
        this.currentView = viewType;
    }
}

// Global functions
function addToCart(productId) {
    console.log('Adding to cart:', productId);
    let cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    localStorage.setItem('beautyTimesCart', JSON.stringify(cart));
    showCartFeedback('Product added to cart!');
}

function toggleWishlist(productId) {
    console.log('Toggling wishlist:', productId);
    let wishlist = JSON.parse(localStorage.getItem('beautyTimesWishlist')) || [];
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showCartFeedback('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showCartFeedback('Added to wishlist');
    }

    localStorage.setItem('beautyTimesWishlist', JSON.stringify(wishlist));
}

function showCartFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e64ca4;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        z-index: 3000;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Initialize when DOM is loaded
console.log('Waiting for DOM to load...');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing products filter...');
    
    // Check if we're on the products page
    if (document.querySelector('.products-page')) {
        console.log('Products page detected, creating filter...');
        window.productsFilter = new ProductsFilter();
        console.log('Products filter created successfully');
    } else {
        console.log('Not on products page');
    }
});

console.log('Products filter script execution complete');