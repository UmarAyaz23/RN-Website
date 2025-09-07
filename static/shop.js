function viewProduct(name, price, image, smallImages, description) {
    let product = {
        name: name,
        price: price,
        image: image,
        smallImages: smallImages, // Store small images array
        description: description
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "/product"; // Redirect to product page
}

// Fetch products from backend API and render them
const productContainer = document.getElementById('productContainer');

// Replace with your deployed FastAPI backend URL
const apiUrl = "http://127.0.0.1:8000/products";  // UPDATE THIS

fetch(apiUrl)
    .then(response => response.json())
    .then(products => {
        products.forEach(prod => {
            const prodDiv = document.createElement('div');
            prodDiv.classList.add('prod');

            prodDiv.innerHTML = `
                <img src="${prod.imageUrl}" alt="">
                <div class="desc">
                    <span>RN</span>
                    <h5>${prod.name}</h5>
                    <span>${prod.description.substring(0, 50)}...</span>
                    <h4>${prod.price}/- PKR</h4>
                </div>
                <button class="dark">Add To Cart</button>
            `;

            prodDiv.onclick = () => viewProduct(
                "RN's " + prod.name,
                prod.price,
                prod.imageUrl,
                [prod.smallImg01, smallImg02, smallImg03, smallImg04],  // Assuming only 1 image for now
                prod.description
            );

            productContainer.appendChild(prodDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = "<p>Failed to load products. Try again later.</p>";
    });