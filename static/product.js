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

    document.querySelector(".prodText button.dark").addEventListener("click", function () {
        let productName = document.querySelector(".prodText h4").innerText;
        let productCategory = document.getElementById("productCategory").innerText;
        let productPrice = parseInt(document.querySelector(".prodText h2").innerText.replace("Rs.", ""));
        let productImage = document.querySelector(".prodImage img").src;
        let quantity = parseInt(document.querySelector(".prodText input").value);

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