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
document.addEventListener('DOMContentLoaded', function() {
    const originalsBtn = document.getElementById('originalsBtn');
    const impressionsBtn = document.getElementById('impressionsBtn');

    // Handle button clicks
    originalsBtn.addEventListener('click', function() {
        // Toggle active state
        this.classList.toggle('active');
        // Remove active from other button if it's active
        if (this.classList.contains('active')) {
            impressionsBtn.classList.remove('active');
        }
        filterAndSortProducts();
    });

    impressionsBtn.addEventListener('click', function() {
        // Toggle active state
        this.classList.toggle('active');
        // Remove active from other button if it's active
        if (this.classList.contains('active')) {
            originalsBtn.classList.remove('active');
        }
        filterAndSortProducts();
    });

    let allProducts = [];

    function filterAndSortProducts() {
        const originalsActive = originalsBtn.classList.contains('active');
        const impressionsActive = impressionsBtn.classList.contains('active');
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
        if (originalsActive || impressionsActive) {
            filteredProducts = filteredProducts.filter(product => {
                if (originalsActive && product.collection === 'original') return true;
                if (impressionsActive && product.collection === 'impression') return true;
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

            prodContainer.appendChild(prodDiv);
        });
    }
});


// Add event listeners for filters and sort
document.addEventListener('DOMContentLoaded', function() {
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