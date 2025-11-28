// Products data for the products page - NOW FETCHING FROM DJANGO API
class ProductsData {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentSort = 'featured';
        this.currentView = 'grid';
        this.filters = {
            categories: [],
            brands: [],
            skinTypes: [],
            concerns: [],
            ratings: [],
            priceRange: [0, 50000],
            availability: ['in-stock']
        };
    }

    async loadProducts() {
        // Define the absolute URL of your running Django server
        const BASE_URL = 'http://127.0.0.1:8000';
        const API_URL = `${BASE_URL}/api/products/`; 
        
        try {
            const response = await fetch(API_URL); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const apiProducts = await response.json();
            
            this.products = apiProducts.map(p => ({
                id: p.id.toString(),
                title: p.title,
                brand: p.brand,
                
                price: parseFloat(p.price), 
                originalPrice: p.original_price ? parseFloat(p.original_price) : 0,
                
                // 1. Main Image (Absolute URL)
                image: p.image ? `${BASE_URL}${p.image}` : '', 
                
                // 2. CRITICAL FIX: Map the Image Gallery and make URLs absolute
                image_gallery: p.image_gallery ? p.image_gallery.map(img => ({
                    url: `${BASE_URL}${img.url}`,
                    is_main: img.is_main
                })) : [],

                category: p.category,
                rating: 4.5, 
                reviewCount: 1, 
                isNew: p.is_new,
                isBestseller: p.is_bestseller,
                inStock: p.in_stock,
                description: p.description
            }));
            
        } catch (error) {
            console.error('Failed to load products from API.', error);
            this.products = [];
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price range filter
            if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
                return false;
            }

            // Availability filter
            if (this.filters.availability.length > 0 && !this.filters.availability.includes('in-stock')) {
                if (product.inStock) return false;
            }

            return true;
        });

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

    getTotalPages() {
        return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    }

    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.currentPage = 1;
        this.applyFilters();
    }

    setSort(sortType) {
        this.currentSort = sortType;
        this.sortProducts();
    }

    setView(viewType) {
        this.currentView = viewType;
    }

    setPage(page) {
        this.currentPage = page;
    }
}

// Make ProductsData available globally
window.ProductsData = ProductsData;