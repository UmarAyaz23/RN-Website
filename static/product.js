document.addEventListener("DOMContentLoaded", function () {
    let product = JSON.parse(localStorage.getItem("selectedProduct"));

    if (!product) {
        alert("No product found!");
        window.location.href = "/shop"; // Redirect if no product is found
        return;
    }

    // Insert main product details
    document.getElementById("productName").innerText = product.name;
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
});
