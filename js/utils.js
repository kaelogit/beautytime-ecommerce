// Utility functions
class Utils {
    static formatPrice(price) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static getCartCount() {
        const cart = JSON.parse(localStorage.getItem('beautyTimesCart')) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    static updateCartCount() {
        const count = this.getCartCount();
        
        // Update Desktop Icon
        const cartCountDesktop = document.getElementById('cart-count');
        if (cartCountDesktop) cartCountDesktop.textContent = count;

        // Update Mobile Icon
        const cartCountMobile = document.getElementById('cart-count-mobile');
        if (cartCountMobile) cartCountMobile.textContent = count;
    }

    // THIS FUNCTION IS NOW CORRECTLY PLACED INSIDE THE CLASS
    static generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }
}