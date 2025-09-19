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


document.addEventListener("DOMContentLoaded", function() {
    // Desktop cart click handler
    const cartLink = document.querySelector("#cart a");
    cartLink.addEventListener('click', function(e) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            e.preventDefault(); // Prevent navigation
            alert("Cart is Empty"); // Use custom alert if you have it, or regular alert
            return false;
        }
    });

    // Mobile cart click handler
    const mobileCartLink = document.querySelector("#tablet a");
    mobileCartLink.addEventListener('click', function(e) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            e.preventDefault();
            alert("Cart is Empty");
            return false;
        }
    });

    updateCartCount();
});

// Call this function when page loads
document.addEventListener("DOMContentLoaded", updateCartCount);

// Update counter when localStorage changes
window.addEventListener("storage", updateCartCount);


// Search Bar
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let products = [];

    fetch('/products')
        .then(response => response.json())
        .then(data => {
            products = data;
        })
        .catch(error => console.error('Error fetching products: ', error));

    
    // Search Input
    searchInput.addEventListener('input', function(e){
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const matchedProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );


        // Display Results
        if (matchedProducts.length > 0) {
            searchResults.innerHTML = matchedProducts
                .slice(0, 5)
                .map(product => `
                    <div class="search-result-item" onclick="viewProduct('${product.name}', ${product.price}, '${product.imageURL}', ['${product.smallImg01}', '${product.smallImg02}','${product.smallImg03}','${product.smallImg04}'], '${product.description}', '${product.category}')">
                        <img src="${product.imageURL}" alt="${product.name}">
                        <div class = "search-result-details">
                            <p class="product-name">${product.name}</p>
                            <span class="product-desc">${product.description}</span>
                            <p class="product-price">PKR ${product.price}/-</p>
                        </div>
                    </div>
                `).join('');
            searchResults.style.display = 'block';
        
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
            searchResults.style.display = 'block';
        }
    });


    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Show results again when clicking on input
    searchInput.addEventListener('click', function() {
        if (this.value.length >= 2) {
            searchResults.style.display = 'block';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const searchModal = document.getElementById('searchModal');
    const navSearchIcon = document.getElementById('navSearchIcon');
    const closeSearch = document.querySelector('.close-search');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.getElementById('mobileSearchResults');
    const loadingBar = document.getElementById('searchLoadingBar');
    let searchTimeout;

    // Open search modal
    navSearchIcon.addEventListener('click', function() {
        searchModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        mobileSearchInput.focus();
    });

    // Close search modal
    closeSearch.addEventListener('click', function() {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Handle click outside modal
    window.addEventListener('click', function(e) {
        if (e.target == searchModal) {
            searchModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle search input with loading indicator
    mobileSearchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        loadingBar.classList.add('active');

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchTerm.length < 2) {
                mobileSearchResults.style.display = 'none';
                loadingBar.classList.remove('active');
                return;
            }

            // Simulate network delay
            fetch('/products')
                .then(response => response.json())
                .then(products => {
                    const matchedProducts = products.filter(product => 
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                    );

                    if (matchedProducts.length > 0) {
                        mobileSearchResults.innerHTML = matchedProducts
                            .slice(0, 5)
                            .map(product => `
                                <div class="search-result-item" onclick="viewProduct('${product.name}', ${product.price}, '${product.imageURL}', ['${product.smallImg01}', '${product.smallImg02}', '${product.smallImg03}', '${product.smallImg04}'], '${product.description}', '${product.category}')">
                                    <img src="${product.imageURL}" alt="${product.name}">
                                    <div class="search-result-details">
                                        <span class="product-name">${product.name}</span>
                                        <span class="product-desc">${product.description}</span>
                                        <span class="product-price">PKR ${product.price}/-</span>
                                    </div>
                                </div>
                            `).join('');
                    } else {
                        mobileSearchResults.innerHTML = '<div class="search-result-item">No products found</div>';
                    }

                    mobileSearchResults.style.display = 'block';
                    loadingBar.classList.remove('active');
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    mobileSearchResults.innerHTML = '<div class="search-result-item">Error loading results</div>';
                    loadingBar.classList.remove('active');
                });
        }, 500);
    });
});