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
        // 1. Define the URL of your LIVE Render Backend
        // (Make sure this is your actual Render link)
        const BASE_URL = 'https://beautytimes-backend.onrender.com'; 
        const API_URL = `${BASE_URL}/api/products/`; 
        
        try {
            // 2. Ask the server for data
            const response = await fetch(API_URL); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // 3. Get the real list from Django
            const apiProducts = await response.json();
            
            // 4. Format it for your website
            this.products = apiProducts.map(p => {
                // Smart Image Logic:
                // If it's a Cloudinary link (starts with http), use it directly.
                // If it's a local path, add the BASE_URL.
                let mainImage = '';
                if (p.image) {
                    mainImage = p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
                }

                let galleryImages = [];
                if (p.image_gallery) {
                    galleryImages = p.image_gallery.map(img => ({
                        url: img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`,
                        is_main: img.is_main
                    }));
                }

                return {
                    id: p.id.toString(),
                    title: p.title,
                    brand: p.brand,
                    
                    price: parseFloat(p.price),
                    originalPrice: p.original_price ? parseFloat(p.original_price) : 0,
                    
                    image: mainImage,
                    image_gallery: galleryImages,
                    
                    category: p.category,
                    rating: 4.5, 
                    reviewCount: 1, 
                    isNew: p.is_new,
                    isBestseller: p.is_bestseller,
                    inStock: p.in_stock,
                    description: p.description
                };
            });
            
            // 5. Randomize the order (Optional - keeps site fresh)
            this.products.sort(() => 0.5 - Math.random());
            
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
                // --- CHANGED: Do nothing here! ---
                // This preserves the random shuffle we applied in loadProducts()
                // instead of forcing a specific "Bestseller" order.
                break;
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