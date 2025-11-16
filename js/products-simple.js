/**
 * BEAUTY TIMES - SIMPLE PRODUCTS FILTER
 * This is a clean, focused products filter system
 * Easy to extend with more features later
 */

// Product data management
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12; // Show 12 products per page
        this.currentSort = 'featured';
        this.currentView = 'grid';
        this.currentCategory = 'all'; // Track current category
        this.filters = {
            categories: [],
            priceRange: [0, 50000]
        };
        
        // Define available categories - EASY TO ADD MORE LATER
        this.categories = [
            { id: 'all', name: 'All Products' },
            { id: 'face-cream', name: 'Face Creams & Serums' },
            { id: 'face-masks', name: 'Face Masks' },
            { id: 'face-scrubs', name: 'Face Scrubs & Exfoliators' },
            { id: 'body-care', name: 'Body Care' },
            { id: 'body-scrubs', name: 'Body Scrubs' },
            { id: 'hand-feet', name: 'Hand & Foot Care' },
            { id: 'fragrance', name: 'Fragrance' },
            { id: 'suncare', name: 'Sun Care' }
            // ADD MORE CATEGORIES HERE:
            // { id: 'new-category', name: 'New Category Name' },
        ];
    }

    // Load products - EASY TO ADD MORE PRODUCTS LATER
    async loadProducts() {
        console.log('🔄 Loading products...');
        
        // Sample product data - IN REAL APP, THIS WOULD COME FROM AN API
        this.products = [
            // Face Creams & Serums
            {
                id: 'p001',
                title: 'Hydrating Face Cream with Hyaluronic Acid',
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
                title: 'Vitamin C Brightening Serum',
                brand: 'RadiantGlow',
                price: 12000,
                originalPrice: 12000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0VOVU0gUFJPRFVDVDwvdGV4dD4KPC9zdmc+',
                category: 'face-cream',
                rating: 4.8,
                reviewCount: 95,
                isNew: true,
                isBestseller: false,
                inStock: true
            },

            // Face Masks
            {
                id: 'p003',
                title: 'Clay Detox Mask for Oily Skin',
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
                title: 'Hydrating Sheet Mask Pack (5 pieces)',
                brand: 'PureSkin',
                price: 4500,
                originalPrice: 6000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0hFRVQgTUFTS1M8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-masks',
                rating: 4.5,
                reviewCount: 134,
                isNew: true,
                isBestseller: false,
                inStock: true
            },

            // Body Care
            {
                id: 'p005',
                title: 'Luxury Body Butter with Shea',
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

            // Fragrance
            {
                id: 'p006',
                title: 'Floral Eau de Parfum',
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

        // GENERATE MORE SAMPLE PRODUCTS TO REACH 800+ ITEMS
        // IN REAL APP, THIS WOULD BE REPLACED WITH ACTUAL PRODUCT DATA
        this.generateSampleProducts(794); // Generate 794 more products to reach 800 total
        
        console.log(`✅ Loaded ${this.products.length} products`);
    }

    // Generate sample products for demonstration
    generateSampleProducts(count) {
        const brands = ['SkinEssentials', 'RadiantGlow', 'PureSkin', 'BodyLuxe', 'ScentEssence', 'SoftTouch', 'GlowTheory', 'YouthfulSkin'];
        const categories = ['face-cream', 'face-masks', 'face-scrubs', 'body-care', 'body-scrubs', 'hand-feet', 'fragrance', 'suncare'];
        
        for (let i = 0; i < count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const price = Math.floor(Math.random() * 20000) + 1000;
            const originalPrice = price + Math.floor(Math.random() * 5000);
            
            this.products.push({
                id: `prod${(this.products.length + 1).toString().padStart(3, '0')}`,
                title: `${brand} ${this.getProductType(category)} ${Math.floor(Math.random() * 1000)}`,
                brand: brand,
                price: price,
                originalPrice: Math.random() > 0.7 ? originalPrice : price,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UFJPRFVDVDwvdGV4dD4KPC9zdmc+',
                category: category,
                rating: 3.5 + Math.random() * 1.5, // Random rating between 3.5 and 5
                reviewCount: Math.floor(Math.random() * 200),
                isNew: Math.random() > 0.8,
                isBestseller: Math.random() > 0.7,
                inStock: Math.random() > 0.1 // 90% in stock
            });
        }
    }

    getProductType(category) {
        const types = {
            'face-cream': ['Moisturizer', 'Serum', 'Cream', 'Lotion'],
            'face-masks': ['Mask', 'Treatment', 'Pack'],
            'face-scrubs': ['Scrub', 'Exfoliator', 'Polish'],
            'body-care': ['Lotion', 'Butter', 'Oil', 'Spray'],
            'body-scrubs': ['Scrub', 'Polish', 'Exfoliator'],
            'hand-feet': ['Cream', 'Treatment', 'Lotion'],
            'fragrance': ['Perfume', 'Mist', 'Spray'],
            'suncare': ['Sunscreen', 'Protection', 'Lotion']
        };
        const categoryTypes = types[category] || ['Product'];
        return categoryTypes[Math.floor(Math.random() * categoryTypes.length)];
    }

    // Apply current filters to products
    applyFilters() {
        console.log('🔍 Applying filters...');
        
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }
            
            // Price range filter
            if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
                return false;
            }
            
            return true;
        });

        this.sortProducts();
        console.log(`📊 Filtered to ${this.filteredProducts.length} products`);
    }

    // Sort products based on current sort option
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

    // Get products for current page
    getCurrentPageProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
    }

    // Get total number of pages
    getTotalPages() {
        return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    }

    // Update filters
    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.currentPage = 1; // Reset to first page when filters change
        this.applyFilters();
    }

    // Set category from URL parameter
    setCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam && this.categories.some(cat => cat.id === categoryParam)) {
            this.currentCategory = categoryParam;
            this.filters.categories = [categoryParam];
            this.updatePageTitle(categoryParam);
        } else {
            this.currentCategory = 'all';
            this.filters.categories = [];
        }
    }

    // Update page title based on category
    updatePageTitle(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
            document.getElementById('page-title').textContent = category.name;
            document.getElementById('page-category').textContent = category.name;
        }
    }
}

// Products filter and display management
class ProductsFilter {
    constructor() {
        this.productManager = new ProductManager();
        this.init();
    }

    async init() {
        console.log('🚀 Initializing products filter...');
        
        // Set up category from URL first
        this.productManager.setCategoryFromURL();
        
        // Load products and initialize
        await this.productManager.loadProducts();
        this.productManager.applyFilters();
        
        // Set up UI components
        this.setupCategoriesFilter();
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsCount();
        this.setupPagination();
        
        console.log('✅ Products filter initialized successfully');
    }

    // Set up categories filter options
    setupCategoriesFilter() {
        const categoriesContainer = document.getElementById('categories-filter');
        if (!categoriesContainer) return;

        const categoriesHTML = this.productManager.categories.map(category => `
            <label class="filter-option">
                <input type="checkbox" name="category" value="${category.id}" 
                    ${this.productManager.filters.categories.includes(category.id) ? 'checked' : ''}>
                <span class="checkmark"></span>
                ${category.name}
            </label>
        `).join('');

        categoriesContainer.innerHTML = categoriesHTML;
    }

    // Set up event listeners
    setupEventListeners() {
        // Category filter changes
        document.addEventListener('change', (e) => {
            if (e.target.name === 'category') {
                this.handleCategoryChange();
            }
        });

        // Price filter apply button
        const applyPriceBtn = document.getElementById('apply-price');
        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', () => this.handlePriceChange());
        }

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.productManager.currentSort = e.target.value;
                this.productManager.sortProducts();
                this.renderProducts();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                
                const view = e.target.closest('.view-btn').dataset.view;
                this.productManager.currentView = view;
                this.renderProducts();
            });
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        // Reset filters (no results)
        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }
    }

    // Handle category filter changes
    handleCategoryChange() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value)
            .filter(category => category !== 'all'); // Exclude 'all' from filters

        this.productManager.updateFilters({
            categories: selectedCategories
        });

        this.renderProducts();
        this.updateActiveFilters();
        this.updateResultsCount();
        this.setupPagination();
    }

    // Handle price range changes
    handlePriceChange() {
        const minPrice = parseInt(document.getElementById('min-price').value) || 0;
        const maxPrice = parseInt(document.getElementById('max-price').value) || 50000;
        
        this.productManager.updateFilters({
            priceRange: [minPrice, maxPrice]
        });

        this.renderProducts();
        this.updateActiveFilters();
        this.updateResultsCount();
        this.setupPagination();
    }

    // Clear all filters
    clearAllFilters() {
        // Uncheck all category checkboxes except 'all'
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.checked = checkbox.value === 'all';
        });

        // Reset price range
        document.getElementById('min-price').value = 0;
        document.getElementById('max-price').value = 50000;

        // Reset filters in manager
        this.productManager.updateFilters({
            categories: [],
            priceRange: [0, 50000]
        });

        // Reset URL if there was a category parameter
        if (window.location.search.includes('category')) {
            window.history.replaceState({}, '', 'products.html');
        }

        this.renderProducts();
        this.updateActiveFilters();
        this.updateResultsCount();
        this.setupPagination();
    }

    // Render products to the grid
    renderProducts() {
        const grid = document.getElementById('products-grid');
        const loading = document.getElementById('loading-state');
        const noResults = document.getElementById('no-results');

        if (!grid) {
            console.error('❌ Products grid element not found!');
            return;
        }

        // Hide loading state (we're not using it for now)
        if (loading) loading.style.display = 'none';

        const products = this.productManager.getCurrentPageProducts();
        
        if (products.length === 0) {
            // Show no results state
            if (noResults) noResults.style.display = 'flex';
            grid.style.display = 'none';
        } else {
            // Render products
            grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
            grid.style.display = 'grid';
            if (noResults) noResults.style.display = 'none';

            // Apply view mode
            if (this.productManager.currentView === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        }
    }

    // Create product card HTML - UPDATED WITH VIEW DETAILS BUTTON
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
                        
                        <!-- VIEW DETAILS BUTTON -->
                        <a href="product.html?id=${product.id}" class="view-details-btn">
                            View Details
                        </a>
                        
                        <button class="wishlist-btn" onclick="toggleWishlist('${product.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate star rating HTML
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

    // Format price with Nigerian Naira
    formatPrice(price) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price);
    }

    // Update results count
    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        const totalProducts = document.getElementById('total-products');
        
        if (resultsCount && totalProducts) {
            resultsCount.textContent = this.productManager.filteredProducts.length;
            totalProducts.textContent = this.productManager.products.length;
        }
    }

    // Update active filters display
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;

        const selectedFilters = [];

        // Get active categories
        document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
            if (checkbox.value !== 'all') {
                const category = this.productManager.categories.find(cat => cat.id === checkbox.value);
                if (category) {
                    selectedFilters.push({
                        type: 'category',
                        value: checkbox.value,
                        label: category.name
                    });
                }
            }
        });

        // Add price range if not default
        const minPrice = parseInt(document.getElementById('min-price').value) || 0;
        const maxPrice = parseInt(document.getElementById('max-price').value) || 50000;
        
        if (minPrice > 0 || maxPrice < 50000) {
            selectedFilters.push({
                type: 'price',
                value: 'price-range',
                label: `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`
            });
        }

        // Render active filters
        if (selectedFilters.length === 0) {
            activeFiltersContainer.innerHTML = '';
        } else {
            activeFiltersContainer.innerHTML = selectedFilters.map(filter => `
                <div class="filter-tag">
                    ${filter.label}
                    <button onclick="productsFilter.removeFilter('${filter.type}', '${filter.value}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Remove specific filter
    removeFilter(filterType, filterValue) {
        if (filterType === 'price') {
            document.getElementById('min-price').value = 0;
            document.getElementById('max-price').value = 50000;
            this.handlePriceChange();
        } else if (filterType === 'category') {
            const checkbox = document.querySelector(`input[name="category"][value="${filterValue}"]`);
            if (checkbox) {
                checkbox.checked = false;
                this.handleCategoryChange();
            }
        }
    }

    // Set up pagination
    setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = this.productManager.getTotalPages();
        const currentPage = this.productManager.currentPage;

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="pagination-btn prev" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="productsFilter.goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
                Previous
            </button>
            <div class="pagination-numbers">
        `;

        // Always show first page
        paginationHTML += `
            <button class="page-number ${currentPage === 1 ? 'active' : ''}" 
                onclick="productsFilter.goToPage(1)">1</button>
        `;

        // Show pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            paginationHTML += '<span class="page-dots">...</span>';
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" 
                    onclick="productsFilter.goToPage(${i})">${i}</button>
            `;
        }

        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="page-dots">...</span>';
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            paginationHTML += `
                <button class="page-number ${currentPage === totalPages ? 'active' : ''}" 
                    onclick="productsFilter.goToPage(${totalPages})">${totalPages}</button>
            `;
        }

        paginationHTML += `
            </div>
            <button class="pagination-btn next" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="productsFilter.goToPage(${currentPage + 1})">
                Next
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    // Go to specific page
    goToPage(page) {
        this.productManager.currentPage = page;
        this.renderProducts();
        this.setupPagination();
        // Scroll to top of products
        document.querySelector('.products-main').scrollIntoView({ behavior: 'smooth' });
    }
}

// Global functions for product actions
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
    updateCartCount();
    showCartFeedback('Product added to cart!');
}

function toggleWishlist(productId) {
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
    updateWishlistButtons();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateWishlistButtons() {
    const wishlist = JSON.parse(localStorage.getItem('beautyTimesWishlist')) || [];
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId;
            const icon = btn.querySelector('i');
            
            if (wishlist.includes(productId)) {
                btn.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                btn.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
            }
        }
    });
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
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Add CSS for animations
if (!document.querySelector('style[data-products-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-products-animations', 'true');
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
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, starting products page...');
    
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Update cart count
    updateCartCount();
    
    // Initialize products filter if on products page
    if (document.querySelector('.products-page')) {
        console.log('🛍️ Initializing products page...');
        window.productsFilter = new ProductsFilter();
    }
    
    console.log('🎉 Products page initialization complete!');
});