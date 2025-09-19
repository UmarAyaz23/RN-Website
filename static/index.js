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


document.addEventListener("DOMContentLoaded", function () {
    const menButton = document.querySelector("#menWomen .men button");
    const womenButton = document.querySelector("#menWomen .women button");

    menButton.addEventListener('click', () => {
        localStorage.setItem("shopFilter", "Men");
        window.location.href = "/shop";
    });
    womenButton.addEventListener('click', () => {
        localStorage.setItem("shopFilter", "Women");
        window.location.href = "/shop";
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