// Main JavaScript file - Initializes everything
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize cart count
    if (typeof Utils !== 'undefined') {
        Utils.updateCartCount();
    }

    // Mobile menu functionality
    initMobileMenu();

    // Newsletter form handling
    initNewsletter();

    // Search functionality
    initSearch();

    // Smooth scrolling for anchor links
    initSmoothScroll();

     // Initialize homepage products
    initHomepageProducts();
});

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking on links
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            
            // Show success message
            showCartFeedback('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && typeof Utils !== 'undefined') {
        const debouncedSearch = Utils.debounce((query) => {
            if (query.length > 2) {
                console.log('Searching for:', query);
                // Implement search functionality here
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
}

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Cart feedback function
function showCartFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--pink-deep);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: var(--shadow-hover);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Add to cart function
function addToCart(productId) {
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
    
    if (typeof Utils !== 'undefined') {
        Utils.updateCartCount();
    }
    
    showCartFeedback('Product added to cart!');
}

// Add CSS for animations if not already added
if (!document.querySelector('style[data-products-css]')) {
    const style = document.createElement('style');
    style.setAttribute('data-products-css', 'true');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .quick-view-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 3000;
            align-items: center;
            justify-content: center;
        }

        .quick-view-modal.active {
            display: flex;
        }

        .modal-content {
            background: var(--white);
            border-radius: 15px;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }

        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text);
            cursor: pointer;
            z-index: 1;
        }

        .quick-view-product {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 40px;
        }

        .quick-view-product .product-images img {
            width: 100%;
            border-radius: 10px;
        }

        .product-description {
            color: var(--text-light);
            margin: 15px 0;
            line-height: 1.6;
        }

        .product-features {
            margin: 20px 0;
        }

        .feature {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            color: var(--text-light);
        }

        .feature i {
            color: var(--pink-deep);
        }

        .quick-view-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }

        .error-message {
            text-align: center;
            padding: 40px;
            color: var(--text-light);
        }

        @media (max-width: 768px) {
            .quick-view-product {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 20px;
            }
            
            .quick-view-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add this function to your main.js - Homepage products display
function initHomepageProducts() {
    console.log('🔄 Initializing homepage products...');
    
    // Sample product data for homepage
    const sampleProducts = [
        {
            id: 'p001',
            title: 'Hydrating Face Cream',
            brand: 'SkinEssentials',
            price: 8500,
            originalPrice: 10000,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBSRUdJTUVOVFM8L3RleHQ+Cjwvc3ZnPg==',
            rating: 4.5,
            reviewCount: 128,
            isNew: true,
            isBestseller: true
        },
        {
            id: 'p002',
            title: 'Vitamin C Serum',
            brand: 'RadiantGlow',
            price: 12000,
            originalPrice: 12000,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0VOVU0gUFJPRFVDVDwvdGV4dD4KPC9zdmc+',
            rating: 4.8,
            reviewCount: 95,
            isNew: true,
            isBestseller: false
        },
        {
            id: 'p003',
            title: 'Clay Detox Mask',
            brand: 'PureSkin',
            price: 6500,
            originalPrice: 8000,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBNQVNLUzwvdGV4dD4KPC9zdmc+',
            rating: 4.3,
            reviewCount: 67,
            isNew: false,
            isBestseller: true
        },
        {
            id: 'p004',
            title: 'Body Butter',
            brand: 'BodyLuxe',
            price: 7200,
            originalPrice: 7200,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qk9EWSBDQVJFPC90ZXh0Pgo8L3N2Zz4=',
            rating: 4.6,
            reviewCount: 89,
            isNew: true,
            isBestseller: false
        }
    ];

    // Render new arrivals (products that are new)
    renderHomepageProducts('new-arrivals-grid', sampleProducts.filter(p => p.isNew));
    
    // Render bestsellers (products that are bestsellers)
    renderHomepageProducts('best-sellers-grid', sampleProducts.filter(p => p.isBestseller));
    
    console.log('✅ Homepage products initialized');
}

function renderHomepageProducts(gridId, products) {
    const grid = document.getElementById(gridId);
    if (!grid) {
        console.error(`❌ Grid element not found: ${gridId}`);
        return;
    }

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
                ${product.originalPrice > product.price ? 
                    `<span class="product-badge discount">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${generateStarRating(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    return stars;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(price);
}