// Products data for the products page
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
        // Extended product data for the products page
        this.products = [
            {
                id: 'p001',
                title: 'Hydrating Face Cream with Hyaluronic Acid',
                brand: 'SkinEssentials',
                price: 8500,
                originalPrice: 10000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+RkFDRSBSRUdJTUVOVFM8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-cream',
                brandSlug: 'skin-essentials',
                skinType: ['dry', 'normal'],
                concerns: ['dullness', 'aging'],
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
                category: 'face-serum',
                brandSlug: 'radiant-glow',
                skinType: ['all'],
                concerns: ['dark-spots', 'dullness'],
                rating: 4.8,
                reviewCount: 95,
                isNew: true,
                isBestseller: false,
                inStock: true
            },
            {
                id: 'p003',
                title: 'Clay Detox Mask for Oily Skin',
                brand: 'PureSkin',
                price: 6500,
                originalPrice: 8000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkFDRSBNQVNLUzwvdGV4dD4KPC9zdmc+',
                category: 'face-masks',
                brandSlug: 'pure-skin',
                skinType: ['oily', 'combination'],
                concerns: ['acne', 'redness'],
                rating: 4.3,
                reviewCount: 67,
                isNew: false,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p004',
                title: 'Luxury Body Butter with Shea',
                brand: 'BodyLuxe',
                price: 7200,
                originalPrice: 7200,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qk9EWSBDQVJFPC90ZXh0Pgo8L3N2Zz4=',
                category: 'body-care',
                brandSlug: 'body-luxe',
                skinType: ['dry', 'normal'],
                concerns: ['dullness'],
                rating: 4.6,
                reviewCount: 89,
                isNew: true,
                isBestseller: false,
                inStock: true
            },
            {
                id: 'p005',
                title: 'Gentle Face Scrub with Jojoba Beads',
                brand: 'SoftTouch',
                price: 5500,
                originalPrice: 6500,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC2hbmNob3I9Im1pZGRsZSI+RkFDRSBTQ1JVQlM8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-scrubs',
                brandSlug: 'soft-touch',
                skinType: ['sensitive', 'normal'],
                concerns: ['dullness'],
                rating: 4.4,
                reviewCount: 112,
                isNew: false,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p006',
                title: 'Floral Eau de Parfum',
                brand: 'ScentEssence',
                price: 15000,
                originalPrice: 18000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RlJBR1JBTkNFPC90ZXh0Pgo8L3N2Zz4=',
                category: 'fragrance',
                brandSlug: 'scent-essence',
                skinType: ['all'],
                concerns: [],
                rating: 4.7,
                reviewCount: 203,
                isNew: true,
                isBestseller: false,
                inStock: true
            },
            // Add more products to reach 24...
            {
                id: 'p007',
                title: 'Overnight Repair Cream',
                brand: 'SkinEssentials',
                price: 9500,
                originalPrice: 11000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T0ZFUk1JR0hUIENSRUFNPC90ZXh0Pgo8L3N2Zz4=',
                category: 'face-cream',
                brandSlug: 'skin-essentials',
                skinType: ['dry', 'sensitive'],
                concerns: ['aging', 'redness'],
                rating: 4.2,
                reviewCount: 78,
                isNew: false,
                isBestseller: true,
                inStock: true
            },
            {
                id: 'p008',
                title: 'Hydrating Sheet Mask Pack (5 pieces)',
                brand: 'PureSkin',
                price: 4500,
                originalPrice: 6000,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjOGRjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0hFRVQgTUFTS1M8L3RleHQ+Cjwvc3ZnPg==',
                category: 'face-masks',
                brandSlug: 'pure-skin',
                skinType: ['all'],
                concerns: ['dullness'],
                rating: 4.5,
                reviewCount: 134,
                isNew: true,
                isBestseller: false,
                inStock: true
            }
        ];

        // Duplicate products to have more data for demonstration
        for (let i = 9; i <= 24; i++) {
            const originalProduct = this.products[(i - 1) % 8];
            this.products.push({
                ...originalProduct,
                id: `p${i.toString().padStart(3, '0')}`,
                price: originalProduct.price + Math.floor(Math.random() * 2000),
                originalPrice: originalProduct.originalPrice + Math.floor(Math.random() * 2000),
                rating: 4 + Math.random(),
                reviewCount: Math.floor(Math.random() * 200) + 50,
                isNew: Math.random() > 0.7,
                isBestseller: Math.random() > 0.5
            });
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Brand filter
            if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brandSlug)) {
                return false;
            }

            // Skin type filter
            if (this.filters.skinTypes.length > 0) {
                const hasMatchingSkinType = this.filters.skinTypes.some(type => 
                    product.skinType.includes(type) || product.skinType.includes('all')
                );
                if (!hasMatchingSkinType) return false;
            }

            // Concerns filter
            if (this.filters.concerns.length > 0) {
                const hasMatchingConcern = this.filters.concerns.some(concern =>
                    product.concerns.includes(concern)
                );
                if (!hasMatchingConcern) return false;
            }

            // Rating filter
            if (this.filters.ratings.length > 0) {
                const meetsRating = this.filters.ratings.some(rating =>
                    product.rating >= parseInt(rating)
                );
                if (!meetsRating) return false;
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

// Export for use in other files
let productsData;
// Make ProductsData available globally
window.ProductsData = ProductsData;