const tabNav = document.getElementById('tabNavbar');
const nav = document.getElementById('navbar');
const closeTabNavBar = document.getElementById('closeTabNavBar');

if (tabNav) {
    tabNav.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (closeTabNavBar) {
    closeTabNavBar.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.getElementById("cartCount");
    const mobileCartCount = document.getElementById("mobileCartCount");
    
    if (totalItems > 0) {
        cartCount.style.display = "block";
        mobileCartCount.style.display = "block";
        cartCount.textContent = totalItems;
        mobileCartCount.textContent = totalItems;
    } else {
        cartCount.style.display = "none";
        mobileCartCount.style.display = "none";
    }
}

// Call this function when page loads
document.addEventListener("DOMContentLoaded", updateCartCount);

// Update counter when localStorage changes
window.addEventListener("storage", updateCartCount);