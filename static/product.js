document.addEventListener("DOMContentLoaded", function () {
    let product = JSON.parse(localStorage.getItem("selectedProduct"));

    if (!product) {
        alert("No product found!");
        window.location.href = "/shop"; // Redirect if no product is found
        return;
    }

    // Insert main product details
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productCategory").innerText = product.category;
    document.getElementById("productPrice").innerText = product.price + "/- PKR";
    document.getElementById("mainImg").src = product.image;
    document.getElementById("productDescription").innerText = product.description;

    // Insert small images with proper alignment
    let smallImagesContainer = document.getElementById("smallImagesContainer");
    smallImagesContainer.innerHTML = ""; // Clear existing images

    product.smallImages.forEach((imgSrc) => {
        // Create the div that wraps the image
        let imgCol = document.createElement("div");
        imgCol.classList.add("imgCol"); // Ensuring it follows your CSS layout

        // Create the image
        let img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("smallImg");
        img.width = 100;
        
        // Change main image on click
        img.onclick = function () {
            document.getElementById("mainImg").src = imgSrc;
        };

        // Append image inside the div
        imgCol.appendChild(img);
        smallImagesContainer.appendChild(imgCol);
    });


    // Image Switching
    var mainImg = document.getElementById("mainImg");
    var smallImg = document.getElementsByClassName("smallImg");

    smallImg[0].onclick = function(){
        mainImg.src = smallImg[0].src;
    }

    smallImg[1].onclick = function(){
        mainImg.src = smallImg[1].src;
    }

    smallImg[2].onclick = function(){
        mainImg.src = smallImg[2].src;
    }

    smallImg[3].onclick = function(){
        mainImg.src = smallImg[3].src;
    }
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