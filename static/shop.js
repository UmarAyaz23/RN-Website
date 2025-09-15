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


// Fetch products from backend API and render them
// const productContainer = document.getElementById('productContainer');

// Replace with your deployed FastAPI backend URL
// const apiUrl = "http://127.0.0.1:8000/products";  // UPDATE THIS

// fetch(apiUrl)
//     .then(response => response.json())
//     .then(products => {
//         products.forEach(prod => {
//             const prodDiv = document.createElement('div');
//             prodDiv.classList.add('prod');

//             prodDiv.innerHTML = `
//                 <img src="${prod.imageUrl}" alt="">
//                 <div class="desc">
//                     <span>RN - ${prod.category}</span>
//                     <h5>${prod.name}</h5>
//                     <span>${prod.description.substring(0, 50)}...</span>
//                     <h4>${prod.price}/- PKR</h4>
//                 </div>
//                 <button class="dark">Add To Cart</button>
//             `;

//             prodDiv.onclick = () => viewProduct(
//                 "RN's " + prod.name,
//                 prod.price,
//                 prod.imageUrl,
//                 [prod.smallImg01, prod.smallImg02, prod.smallImg03, prod.smallImg04],  // Assuming only 1 image for now
//                 prod.description,
//                 prod.category
//             );

//             productContainer.appendChild(prodDiv);
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching products:', error);
//         productContainer.innerHTML = "<p>Failed to load products. Try again later.</p>";
//     });


// FILTER AND SORT PRODUCTS    
let allProducts = [];

function filterAndSortProducts() {
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
                <span>RN - ${product.category}</span>
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
            product.category
        );

        prodContainer.appendChild(prodDiv);
    });
}


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
            let productName = productDiv.querySelector(".desc h5").innerText;
            let productCategory = productDiv.querySelector(".desc span").innerText.replace("RN - ", "");
            let productPrice = parseInt(productDiv.querySelector(".desc h4").innerText.replace("/- PKR", ""));
            let productImage = productDiv.querySelector("img").src;
            let quantity = 1;

            let product = {
                name: productName,
                category: productCategory,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };

            // Check if product already exists in cart
            let existingItem = cart.find(item => 
                item.name === product.name && 
                item.category === product.category
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