// Main JavaScript file - Initializes everything
// Requires utils.js, products-data.js (for initHomepageProducts)
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
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            const submitBtn = this.querySelector('button');

            if (!email) return;

            // Change button text to show loading
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send to Django Backend
                const response = await fetch('https://beautytimes-backend.onrender.com/api/newsletter/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });

                const result = await response.json();

                if (result.success) {
                    showCartFeedback(result.message); // Success!
                    this.reset(); // Clear the input
                } else {
                    alert(result.message); // Show error (e.g., "Already subscribed")
                }

            } catch (error) {
                console.error('Newsletter error:', error);
                alert('Something went wrong. Please try again.');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');

    // Function to perform the search action
    const performSearch = (query) => {
        if (query.trim().length > 0) {
            // Redirects to the products page and passes the query in the URL
            window.location.href = `products.html?search=${encodeURIComponent(query.trim())}`;
        }
    };

    if (searchInput) {
        // Search on input (using debounce from Utils if defined)
        if (typeof Utils !== 'undefined') {
            const debouncedSearch = Utils.debounce((query) => {
                // Placeholder for live search dropdown functionality if implemented later
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }

        // 1. Search on Enter key press
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // 2. Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                performSearch(searchInput.value);
            });
        }
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

// Cart feedback function (Used across main.js, products.js, product.js)
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

// Add to cart function (Used across main.js, products.js, product.js)
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
        
        /* Quick View Modal Styles (left for consistency) */
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
        /* ... remaining quick-view modal styles ... */

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


// Function for rendering products on the Homepage (New Arrivals/Bestsellers)
async function initHomepageProducts() {
    if (typeof ProductsData === 'undefined' || typeof Utils === 'undefined') {
        console.error('ProductsData dependency missing. Cannot initialize homepage products.');
        return;
    }
    

    // Assumes ProductsData class is available globally (linked via products-data.js)
    const dataManager = new ProductsData();
    await dataManager.loadProducts(); 

    const allProducts = dataManager.products; 

    // Filter and slice the first 4 products for each section
    const allNew = allProducts.filter(p => p.isNew);
    const allBest = allProducts.filter(p => p.isBestseller);

    const newArrivals = shuffleArray(allNew).slice(0, 8); 
    const bestSellers = shuffleArray(allBest).slice(0, 8);

    renderHomepageProducts('new-arrivals-grid', newArrivals);
    renderHomepageProducts('best-sellers-grid', bestSellers);

}

function renderHomepageProducts(gridId, products) {
    const grid = document.getElementById(gridId);
    if (!grid) {
        return;
    }

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
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
                        ${Utils.generateStarRating(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${Utils.formatPrice(product.price)}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <button class="btn btn-primary add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}