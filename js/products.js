// products.js: Logic for the main shop page
// Requires products-data.js, utils.js, and main.js (for addToCart/showCartFeedback) to be loaded.
document.addEventListener('DOMContentLoaded', async () => {
    // Check for global dependencies (ProductsData and Utils are critical)
    if (typeof ProductsData === 'undefined' || typeof Utils === 'undefined') {
        console.error('Dependencies missing. Ensure products-data.js and utils.js are loaded.');
        return;
    }

    // Initialize the data manager
    const dataManager = new ProductsData();
    await dataManager.loadProducts();

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

    // ----------------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------------
    
    // 1. Initialize UI Controls based on data manager defaults
    minPriceInput.value = dataManager.filters.priceRange[0];
    maxPriceInput.value = dataManager.filters.priceRange[1];

    // 2. Check URL for initial filters (category or search)
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const searchQuery = urlParams.get('search');

    let isFiltered = false;

    if (initialCategory) {
        dataManager.updateFilters({ categories: [initialCategory] });
        const formattedCategory = initialCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        pageTitle.textContent = `Shop ${formattedCategory}`;
        isFiltered = true;
    } 
    
    if (searchQuery) {
        const decodedQuery = decodeURIComponent(searchQuery);
        
        // Use the search helper to find the matching products.
        const searchResults = searchProducts(dataManager.products, decodedQuery);
        
        // CRITICAL FIX: Overwrite the master product list with the search results.
        // This ensures filters/pagination operate ONLY on the search matches.
        dataManager.products = searchResults; 
        
        // Now, apply the standard filters/sorting to the newly filtered list
        dataManager.applyFilters();
        
        pageTitle.textContent = `Search Results for "${decodedQuery}"`;
        isFiltered = true;
    } 
    
    if (!isFiltered) {
        // Load all products only if no filters or search are present
        dataManager.applyFilters();
    }
    
    // 3. Set up initial filter controls (categories)
    setupCategoryFilters();
    
    // 4. Initial UI rendering
    updateUI();


    // ----------------------------------------------------
    // RENDERING FUNCTIONS
    // ----------------------------------------------------

    function renderProducts() {
        const productsToDisplay = dataManager.getCurrentPageProducts();
        const productView = dataManager.currentView;
        
        // Update classes for grid/list view styling
        productsGrid.className = 'products-grid';
        if (productView === 'list') {
            productsGrid.classList.add('list-view');
        }

        if (productsToDisplay.length === 0) {
            productsGrid.innerHTML = '';
            noResultsDiv.style.display = 'flex';
            return;
        }

        noResultsDiv.style.display = 'none';

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
        const totalPages = dataManager.getTotalPages();
        const currentPage = dataManager.currentPage;
        
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        let html = '';

        // Previous button
        html += `<button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-arrow-left"></i> Prev</button>`;

        // Page numbers (simplified)
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                if (paginationContainer.lastElementChild && paginationContainer.lastElementChild.className !== 'page-dots') {
                   html += '<span class="page-dots">...</span>';
                } else if (!paginationContainer.lastElementChild) {
                    html += '<span class="page-dots">...</span>';
                }
            }
        }

        // Next button
        html += `<button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next <i class="fas fa-arrow-right"></i></button>`;

        paginationContainer.innerHTML = html;
        
        // Add listeners for new buttons
        paginationContainer.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                dataManager.setPage(parseInt(btn.dataset.page));
                updateUI();
                window.scrollTo({ top: productsGrid.offsetTop - 100, behavior: 'smooth' });
            });
        });
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentPage > 1) {
                dataManager.setPage(currentPage - 1);
                updateUI();
            }
        });
        document.getElementById('next-btn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                dataManager.setPage(currentPage + 1);
                updateUI();
            }
        });
    }

    // Populates the Category filter sidebar options
    function setupCategoryFilters() {
        const allCategories = [...new Set(dataManager.products.map(p => p.category))];
        
        if (!categoriesFilterDiv) return;

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
    
    // Updates results count, renders products, and pagination
    function updateUI() {
        dataManager.applyFilters(); // Re-apply sort/filters
        
        totalProductsSpan.textContent = dataManager.products.length;
        resultsCountSpan.textContent = dataManager.filteredProducts.length;

        renderProducts();
        renderPagination();
    }

    // ----------------------------------------------------
    // EVENT LISTENERS
    // ----------------------------------------------------

    // 1. Sorting
    sortSelect.addEventListener('change', (e) => {
        dataManager.setSort(e.target.value);
        updateUI();
    });
    
    // 2. View Toggle
    viewToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            dataManager.setView(btn.dataset.view);
            updateUI();
        });
    });

    // 3. Category Checkbox Filter (Delegation)
    categoriesFilterDiv.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"][data-filter-type="category"]')) {
            const selectedCategories = Array.from(categoriesFilterDiv.querySelectorAll('input:checked')).map(input => input.value);
            dataManager.updateFilters({ categories: selectedCategories });
            updateUI();
        }
    });

    // 4. Price Filter
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
    
    // 5. Clear Filters
    clearFiltersBtn.addEventListener('click', () => {
        // Reset data manager filters to the default state
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
        
        // Reset UI controls
        minPriceInput.value = dataManager.filters.priceRange[0];
        maxPriceInput.value = dataManager.filters.priceRange[1];
        sortSelect.value = 'featured';
        
        // Re-run setup to uncheck boxes and re-render
        setupCategoryFilters();
        
        updateUI();
    });
});

// Helper function used in initialization to filter the master product list by search term
function searchProducts(products, query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery)
    );
}

// Mock function for wishlist (to avoid errors)
function toggleWishlist(productId) {
    console.log(`Toggling wishlist state for product: ${productId}`);
    if (typeof showCartFeedback !== 'undefined') {
        showCartFeedback('Wishlist status updated!');
    }
}