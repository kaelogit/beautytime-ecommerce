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
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getCartCount();
        }
    }
}