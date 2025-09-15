document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.querySelector(".desktop-Cart tbody");
    let tabMobileCart = document.querySelector(".tabMobile-Cart");

    function updateCartDisplay() {
        cartTable.innerHTML = ""; // Clear previous entries
        tabMobileCart.innerHTML = "";

        let totalPrice = 0;

        cart.forEach((product, index) => {
            let subtotal = product.price * product.quantity;
            totalPrice += subtotal;
            
            /*-----Desktop View-----*/
            let row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="#" class="remove-item" data-index="${index}"><i class="fa-solid fa-xmark"></i></a></td>
                <td><img src="${product.image}" alt=""></td>
                <td>${product.name} - ${product.category}</td>
                <td>${product.price}/-</td>
                <td><input type="number" value="${product.quantity}" min="1" class="cart-quantity" data-index="${index}"></td>
                <td>${subtotal}/-</td>
            `;
            cartTable.appendChild(row);


            /*-----Mobile View-----*/
            let tabMobileItem = document.createElement("div");
            tabMobileItem.classList.add("tmCart-Item");
            tabMobileItem.innerHTML = `
                <div class = "tmCart-Product">
                    <span class = "tmCart-ProdName">${product.name} - ${product.category}</span>
                    <img src = "${product.image}" alt = ""></td>
                </div>

                <div class = "tmCart-Price">
                    <span>Rs.${product.price}/-</span>
                    <span><input type = "number" min = "1" value = "${product.quantity}">
                    <a href="#" class="remove-item" data-index="${index}"><button class = "red">Remove Item</button></a></span>
                </div>

                
            `;
            tabMobileCart.appendChild(tabMobileItem);
        });

        localStorage.setItem("cart", JSON.stringify(cart));  // Save updates
    }

    updateCartDisplay();


    // Handle quantity change
    cartTable.addEventListener("change", function (e) {
        if (e.target.classList.contains("cart-quantity")) {
            let index = e.target.dataset.index;
            cart[index].quantity = parseInt(e.target.value);
            updateCartDisplay();
        }
    });

    // Handle remove item
    cartTable.addEventListener("click", function (e) {
        if (e.target.closest(".remove-item")) {
            let index = e.target.closest(".remove-item").dataset.index;
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    tabMobileCart.addEventListener("change", function (e) {
        if (e.target.classList.contains("cart-quantity")) {
            let index = e.target.dataset.index;
            cart[index].quantity = parseInt(e.target.value);
            updateCartDisplay();
        }
    });
    
    tabMobileCart.addEventListener("click", function (e) {
        if (e.target.closest(".remove-item")) {
            let index = e.target.closest(".remove-item").dataset.index;
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    // ✅ Correctly select the Checkout button and handle click
    document.querySelector("#cart .dark").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let shippingCost = 200; // Flat shipping cost
        let totalAmount = cart.reduce((acc, product) => acc + product.price * product.quantity, 0) + shippingCost;
        
        localStorage.setItem("orderDetails", JSON.stringify({ cart, totalAmount, shippingCost }));
        
        // ✅ Redirect to the order confirmation page
        window.location.href = "/address_OrderConfirm";
    });
});