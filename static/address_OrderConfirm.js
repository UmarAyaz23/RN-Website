document.addEventListener("DOMContentLoaded", function () {
    // localStorage.setItem("orderNumber", 0); USE THIS TO SET ORDER NUMBER TO 0 ALWAYS, SO EVERY NEW ORDER IS NUMBERED AS 1

    let orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || { cart: [], totalAmount: 0, shippingCost: 0 };
    let orderTable = document.querySelector(".confirmOrder tbody");

    if (orderDetails.cart.length === 0) {
        alert("No items in order!");
        window.location.href = "/shop";
        return;
    }


    // Populate the order table
    orderTable.innerHTML = "";
    let totalSubtotal = 0;

    orderDetails.cart.forEach((product) => {
        let subtotal = product.price * product.quantity;
        totalSubtotal += subtotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${subtotal}/-</td>
        `;
        orderTable.appendChild(row);
    });

    let shippingRow = document.createElement("tr");
    shippingRow.innerHTML = `
        <td>Shipping</td>
        <td>-</td>
        <td>${orderDetails.shippingCost}/-</td>
    `;
    orderTable.appendChild(shippingRow);

    let totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td>-</td>
        <td><strong>${orderDetails.totalAmount}/-</strong></td>
    `;
    orderTable.appendChild(totalRow);


    // Handle the Place Order button click
    document.querySelector("#placeOrder").addEventListener("click", function (event) {
        let name = document.getElementById("name").value.trim();
        let contact = document.getElementById("contact").value.trim();
        let house = document.getElementById("house").value.trim();
        let street = document.getElementById("street").value.trim();
        let area = document.getElementById("area").value.trim();
        let block = document.getElementById("block").value.trim();
        let landmark = document.getElementById("landmark").value.trim();

        if (!name || !contact || !house || !street || !block ||!area) {
            alert("Please fill all required fields before placing the order!");
            event.preventDefault();
            return;
        }

        if (!/^[A-Za-z ]{3,20}$/.test(name)) {
            alert("Invalid name! It should be 3-20 letters only.");
            event.preventDefault();
            return;
        }

        if (!/^[0-9]{11,12}$/.test(contact)) {
            alert("Invalid contact number! It should be 11-12 digits.");
            event.preventDefault();
            return;
        }


	    // Generate a unique order number
        let orderNumber = localStorage.getItem("orderNumber");
        if (!orderNumber) {
            orderNumber = 1; // Start with 1
        } else {
            orderNumber = parseInt(orderNumber) + 1; // Increment order number
        }
        localStorage.setItem("orderNumber", orderNumber); // Save the new order number


        // Store address details
        let addressDetails = { name, contact, house, street, block, area, landmark, city: "Karachi" };
        
        fetch("/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                addressDetails,
                orderDetails: JSON.parse(localStorage.getItem("orderDetails"))
            }),
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === "success") {
                // Store the server-generated order number
                localStorage.setItem("addressDetailsJS", JSON.stringify({ 
                    ...addressDetails, 
                    orderNumber: data.orderNumber 
                }));
                alert(`Order placed successfully! Your Order Number is: ${data.orderNumber}`);
                window.location.href = "/receipt";
            } else {
                throw new Error(data.message || "Failed to save the order");
            }
        })
        .catch((error) => {
            console.error("Error saving order:", error);
            alert(`Error placing order: ${error.message}`);
        });
    });
});