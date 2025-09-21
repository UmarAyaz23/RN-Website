function viewProduct(name, price, image, smallImages, description, category) {
    let product = {
        name: name,
        price: price,
        image: image,
        smallImages: smallImages, // Store small images array
        description: description,
        category: category
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "/product"; // Redirect to product page
}


// FILTER AND SORT PRODUCTS    
let allProducts = [];

function filterAndSortProducts() {
    const originals_button = document.getElementById('originals-button');
    const impressions_button = document.getElementById('impressions-button');
    const originals_Active = originals_button.classList.contains('active');
    const impressions_Active = impressions_button.classList.contains('active');

    const forHimChecked = document.querySelector('input[value="forHim"]').checked;
    const forHerChecked = document.querySelector('input[value="forHer"]').checked;
    const sortValue = document.getElementById('sort').value;

    let filteredProducts = [...allProducts];

    if (forHimChecked || forHerChecked) {
        filteredProducts = filteredProducts.filter(product => {
            if (forHimChecked && product.category === 'Men') return true;
            if (forHerChecked && product.category === 'Women') return true;
            return false;
        });
    }

    // Filter by type (Originals/Impressions)
    if (originals_Active || impressions_Active) {
        filteredProducts = filteredProducts.filter(product => {
            if (originals_Active && product.collection === 'Originals') return true;
            if (impressions_Active && product.collection === 'Impressions') return true;
            return false;
        });
    }


    // Sort Products
    if (sortValue === 'Low-to-High'){
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    } else if (sortValue === 'High-to-Low') {
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }


    // Display filtered & sorted products
    const prodContainer = document.querySelector('.prod-container');
    prodContainer.innerHTML = '';

    filteredProducts.forEach(product => {
        const prodDiv = document.createElement('div');
        prodDiv.classList.add('prod');
        prodDiv.innerHTML = `
            <img src="${product.imageURL}" alt="">
            <div class="desc">
                <span>RN ${product.collection} - ${product.category}</span>
                <h5>${product.name}</h5>
                <span>${product.description}</span>
                <h4>${product.price}/- PKR</h4>
            </div>
            <button class="dark">Add To Cart</button>
        `;

        prodDiv.onclick = () => viewProduct(
            product.name,
            product.price,
            product.imageURL,
            [product.smallImg01, product.smallImg02, product.smallImg03, product.smallImg04],
            product.description,
            product.category,
            product.collection
        );


        // Add separate handler for Add to Cart button
        const addToCartBtn = prodDiv.querySelector('button.dark');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent product view
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let quantity = 1;

            let cartProduct = {
                name: product.name,
                category: product.category,
                collection: product.collection,
                price: product.price,
                image: product.imageURL,
                quantity: quantity
            };

            let existingItem = cart.find(item => 
                item.name === cartProduct.name && 
                item.category === cartProduct.category &&
                item.collection === cartProduct.collection
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push(cartProduct);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart!");
            updateCartCount();
        });

        prodContainer.appendChild(prodDiv);
    });
}


// Add event listeners for filters and sort
document.addEventListener('DOMContentLoaded', function() {
    const originals_button = document.getElementById('originals-button');
    const impressions_button = document.getElementById('impressions-button');

    // Handle button clicks
    originals_button.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            impressions_button.classList.remove('active');
        }
        filterAndSortProducts();
    });

    impressions_button.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            originals_button.classList.remove('active');
        }
        filterAndSortProducts();
    });

    // Add change listeners to checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterAndSortProducts);
    });

    // Add change listener to sort select
    document.getElementById('sort').addEventListener('change', filterAndSortProducts);

    // Fetch initial products
    fetch("/products")
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            filterAndSortProducts(); // Initial display
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.querySelector('.prod-container').innerHTML = 
                "<p>Failed to load products. Please try again later.</p>";
        });
});



// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Modal functionality
    const modal = document.getElementById('filter-modal');
    const filterBtn = document.getElementById('filterModal-button');
    const closeBtn = document.querySelector('.close');
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    const originalsBtn = document.getElementById('originals-button-mobile');
    const impressionsBtn = document.getElementById('impressions-button-mobile');

    filterBtn.onclick = function() {
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    originalsBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            impressionsBtn.classList.remove('active');
        }
    });

    impressionsBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            originalsBtn.classList.remove('active');
        }
    });

    applyBtn.addEventListener('click', function() {
        // Transfer mobile selections to main filters
        const originalsMain = document.getElementById('originals-button');
        const impressionsMain = document.getElementById('impressions-button');
        
        originalsMain.classList.toggle('active', originalsBtn.classList.contains('active'));
        impressionsMain.classList.toggle('active', impressionsBtn.classList.contains('active'));
        
        filterAndSortProducts();
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    });

    clearBtn.addEventListener('click', function() {
        // Clear all filters
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        originalsBtn.classList.remove('active');
        impressionsBtn.classList.remove('active');
        document.getElementById('originals-button').classList.remove('active');
        document.getElementById('impressions-button').classList.remove('active');
        filterAndSortProducts();
    });
});


// Add to Cart
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add click listeners to all Add To Cart buttons
    document.querySelectorAll(".prod button.dark").forEach(button => {
        button.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent triggering the product view onclick
            
            // Get the parent product div
            const productDiv = this.closest('.prod');
            
            // Get product details from the specific product div
            let productInfo = productDiv.querySelector(".desc span").innerText.split(" - ");
            let productCollection = productInfo[0].replace("RN ", "");
            let productCategory = productInfo[1];
            let productName = productDiv.querySelector(".desc h5").innerText;
            let productPrice = parseInt(productDiv.querySelector(".desc h4").innerText.replace("/- PKR", ""));
            let productImage = productDiv.querySelector("img").src;
            let quantity = 1;

            let product = {
                name: productName,
                category: productCategory,
                collection: productCollection,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };

            // Check if product already exists in cart
            let existingItem = cart.find(item => 
                item.name === product.name && 
                item.category === product.category &&
                item.collection === product.collection
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart!");
            updateCartCount();
        });
    });
});