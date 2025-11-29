// products.js: Logic for the main shop page
// Requires products-data.js, utils.js, and main.js to be loaded.

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check for global dependencies
    if (typeof ProductsData === 'undefined' || typeof Utils === 'undefined') {
        console.error('Dependencies missing. Ensure products-data.js and utils.js are loaded.');
        return;
    }

    // 2. Initialize the data manager
    const dataManager = new ProductsData();
    
    // Show loading state immediately if elements exist
    const loadingState = document.getElementById('loading-state');
    if (loadingState) loadingState.style.display = 'flex';

    try {
        await dataManager.loadProducts();
    } catch (err) {
        console.error("Error loading products:", err);
    }

    // ----------------------------------------------------
    // DOM ELEMENTS
    // ----------------------------------------------------
    const productsGrid = document.getElementById('products-grid');
    const sortSelect = document.getElementById('sort-select');
    const viewToggleButtons = document.querySelectorAll('.view-btn');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyPriceBtn = document.getElementById('apply-price');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const totalProductsSpan = document.getElementById('total-products');
    const resultsCountSpan = document.getElementById('results-count');
    const paginationContainer = document.getElementById('pagination');
    const pageTitle = document.getElementById('page-title');
    const categoriesFilterDiv = document.getElementById('categories-filter');
    const noResultsDiv = document.getElementById('no-results');
    
    // Mobile Sidebar Elements
    const mobileFilterBtn = document.getElementById('mobile-filters-toggle');
    const sidebar = document.querySelector('.filters-sidebar');

    // ----------------------------------------------------
    // INITIALIZATION & URL HANDLING
    // ----------------------------------------------------
    
    // Initialize UI Controls based on defaults
    if (minPriceInput) minPriceInput.value = dataManager.filters.priceRange[0];
    if (maxPriceInput) maxPriceInput.value = dataManager.filters.priceRange[1];

    // Check URL for initial filters (category or search)
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const searchQuery = urlParams.get('search');

    let isFiltered = false;

    if (initialCategory) {
        dataManager.updateFilters({ categories: [initialCategory] });
        // Format category name for title (e.g., "face-cream" -> "Face Cream")
        const formattedCategory = initialCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (pageTitle) pageTitle.textContent = `Shop ${formattedCategory}`;
        isFiltered = true;
    } 
    
    if (searchQuery) {
        const decodedQuery = decodeURIComponent(searchQuery);
        
        // 1. Filter the master list based on search term
        const searchResults = searchProducts(dataManager.products, decodedQuery);
        
        // 2. Overwrite master list so subsequent filters apply to search results
        dataManager.products = searchResults; 
        
        if (pageTitle) pageTitle.textContent = `Search Results for "${decodedQuery}"`;
        isFiltered = true;
        
        // Apply filters to the new shortened list
        dataManager.applyFilters();
    } 
    
    if (!isFiltered) {
        // Load all products if no specific filter is requested
        dataManager.applyFilters();
    }
    
    // Setup UI
    setupCategoryFilters();
    updateUI();


    // ----------------------------------------------------
    // RENDERING FUNCTIONS
    // ----------------------------------------------------

    function renderProducts() {
        if (!productsGrid) return;

        const productsToDisplay = dataManager.getCurrentPageProducts();
        const productView = dataManager.currentView;
        
        // Handle Loading/No Results states
        if (loadingState) loadingState.style.display = 'none';
        
        // Update classes for grid/list view styling
        productsGrid.className = 'products-grid';
        if (productView === 'list') {
            productsGrid.classList.add('list-view');
        }

        if (productsToDisplay.length === 0) {
            productsGrid.innerHTML = '';
            if (noResultsDiv) noResultsDiv.style.display = 'flex';
            return;
        }

        if (noResultsDiv) noResultsDiv.style.display = 'none';

        productsGrid.innerHTML = productsToDisplay.map(product => `
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
                        <div class="rating-stars">${Utils.generateStarRating(product.rating)}</div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${Utils.formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = dataManager.getTotalPages();
        const currentPage = dataManager.currentPage;
        
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        let html = '';

        // Previous button
        html += `<button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-arrow-left"></i> Prev</button>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                // Add dots but prevent double dots
                if (!html.endsWith('<span class="page-dots">...</span>')) {
                     html += '<span class="page-dots">...</span>';
                }
            }
        }

        // Next button
        html += `<button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next <i class="fas fa-arrow-right"></i></button>`;

        paginationContainer.innerHTML = html;
        
        // Add listeners
        paginationContainer.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                dataManager.setPage(parseInt(btn.dataset.page));
                updateUI();
                window.scrollTo({ top: productsGrid.offsetTop - 100, behavior: 'smooth' });
            });
        });
        
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    dataManager.setPage(currentPage - 1);
                    updateUI();
                }
            });
        }

        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    dataManager.setPage(currentPage + 1);
                    updateUI();
                }
            });
        }
    }

    function setupCategoryFilters() {
        if (!categoriesFilterDiv) return;
        
        // Extract unique categories from the loaded products
        const allCategories = [...new Set(dataManager.products.map(p => p.category))];
        
        categoriesFilterDiv.innerHTML = allCategories.map(cat => {
            const displayName = cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const isChecked = dataManager.filters.categories.includes(cat);
            return `
                <label class="filter-option">
                    <input type="checkbox" data-filter-type="category" value="${cat}" ${isChecked ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    ${displayName}
                </label>
            `;
        }).join('');
    }
    
    function updateUI() {
        dataManager.applyFilters(); // Re-run filter logic from ProductsData class
        
        if (totalProductsSpan) totalProductsSpan.textContent = dataManager.products.length;
        if (resultsCountSpan) resultsCountSpan.textContent = dataManager.filteredProducts.length;

        renderProducts();
        renderPagination();
    }

    // ----------------------------------------------------
    // EVENT LISTENERS
    // ----------------------------------------------------

    // 1. Sorting
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            dataManager.setSort(e.target.value);
            updateUI();
        });
    }
    
    // 2. View Toggle
    viewToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            dataManager.setView(btn.dataset.view);
            updateUI();
        });
    });

    // 3. Category Checkbox Filter
    if (categoriesFilterDiv) {
        categoriesFilterDiv.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"][data-filter-type="category"]')) {
                const selectedCategories = Array.from(categoriesFilterDiv.querySelectorAll('input:checked')).map(input => input.value);
                dataManager.updateFilters({ categories: selectedCategories });
                updateUI();
            }
        });
    }

    // 4. Price Filter
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            const min = parseInt(minPriceInput.value) || 0;
            const max = parseInt(maxPriceInput.value) || dataManager.filters.priceRange[1];
    
            if (min <= max) {
                dataManager.updateFilters({ priceRange: [min, max] });
                updateUI();
            } else {
                alert('Minimum price cannot be greater than maximum price.');
            }
        });
    }
    
    // 5. Clear Filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            dataManager.filters = {
                categories: [],
                brands: [],
                skinTypes: [],
                concerns: [],
                ratings: [],
                priceRange: [0, 50000],
                availability: ['in-stock']
            };
            dataManager.currentPage = 1;
            
            if (minPriceInput) minPriceInput.value = dataManager.filters.priceRange[0];
            if (maxPriceInput) maxPriceInput.value = dataManager.filters.priceRange[1];
            if (sortSelect) sortSelect.value = 'featured';
            
            setupCategoryFilters();
            updateUI();
        });
    }

    // 6. Mobile Sidebar Toggle
    if (mobileFilterBtn && sidebar) {
        mobileFilterBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !mobileFilterBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
});


// Helper function used in initialization to filter the master product list by search term
function searchProducts(products, query) {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery)
    );
}

// Helper function for wishlist (mock implementation)
function toggleWishlist(productId) {
    if (typeof showCartFeedback !== 'undefined') {
        showCartFeedback('Wishlist functionality coming soon!');
    }
}