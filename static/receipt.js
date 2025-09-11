document.addEventListener("DOMContentLoaded", function () {
    let orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    let addressDetails = JSON.parse(localStorage.getItem("addressDetailsJS"));

    if (!orderDetails || !addressDetails) {
        alert("No order details found!");
        window.location.href = "/shop";
        return;
    }

    // Function to calculate estimated delivery date
    function calculateDeliveryDate(startDate, businessDays) {
        let currentDate = new Date(startDate);
        let daysAdded = 0;
        while (daysAdded < businessDays) {
            currentDate.setDate(currentDate.getDate() + 1); // Add one day
            // Skip weekends (Saturday and Sunday)
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                daysAdded++;
            }
        }
        return currentDate.toDateString(); // Format the date as MM/DD/YYYY
    }

    // Calculate delivery date range (3 to 5 business days)
    let today = new Date();
    let deliveryStart = calculateDeliveryDate(today, 3);
    let deliveryEnd = calculateDeliveryDate(today, 5);

    // Populate the order text with estimated delivery date
    let orderTextDiv = document.querySelector(".orderText");
    orderTextDiv.innerHTML = `
        <h4>RN | ORDER NUMBER: ${addressDetails.orderNumber}</h4>
        <span>Est. Delivery | ${deliveryStart} - ${deliveryEnd}</span>
    `;

    // Populate address details
    let addressDiv = document.querySelector(".addressDetails");
    addressDiv.innerHTML = `
        <form id="receipt-addressDetails">
            <input type="text" id="name" placeholder="${addressDetails.name}" disabled>

            <input type="text" id="contact" placeholder="${addressDetails.contact}" disabled>

            <input type="text" id="house" placeholder="${addressDetails.house}" disabled>

            <input type="text" id="street" placeholder="${addressDetails.street}" disabled>

            <input type="text" id="block" placeholder="Block ${addressDetails.block}" disabled>

            <input type="text" id="area" placeholder="${addressDetails.area}" disabled>

            <input type="text" id="landmark" placeholder="${addressDetails.landmark}" disabled>

            <input type="text" placeholder="${addressDetails.city}" disabled>
        </form>
    `;

    // Populate order details
    let orderTable = document.querySelector(".orderedProdDetails table tbody");
    orderDetails.cart.forEach((product) => {
        let subtotal = product.price * product.quantity;
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name} - ${product.category}</td>
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

    window.addEventListener("beforeunload", function() {
        localStorage.removeItem("cart");
        localStorage.removeItem("orderDetails");
        localStorage.removeItem("addressDetailsJS");  // Also remove address details
    });

    // Handle Print Receipt button
    document.querySelector(".dark").addEventListener("click", function () {
        window.print();
    });
});
