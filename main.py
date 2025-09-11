from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from models import Product, Order
from database import product_collection, order_collection

from dotenv import load_dotenv
from pydantic import EmailStr

import os, random
from datetime import datetime
from typing import List


#--------------------------------------------------APP SETUP--------------------------------------------------
app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


mail_config = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)
fastMail = FastMail(mail_config)


#--------------------------------------------------PAGE REQUEST HANDLING--------------------------------------------------
# Home Page
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    try:
        products = list(
            product_collection.find().sort([
                ("placed_orders", -1),
                ("_id", -1)
            ]).limit(3)
        )
        for product in products:
            product["_id"] = str(product["_id"])

    except Exception as e:
        print(f"Error: {e}")
        products = []

    return templates.TemplateResponse("index.html", {"request": request, "products": products})


# Shop Page (fetch products from DB)
@app.get("/shop", response_class=HTMLResponse)
def shop(request: Request):
    try:
        products = list(product_collection.find())
        for product in products:
            product["_id"] = str(product["_id"])

    except Exception as e:
        print(f"Error: {e}")
        products = []

    return templates.TemplateResponse("shop.html", {"request": request, "products": products})


# Contact Page
@app.get("/contact", response_class=HTMLResponse)
def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})


# Cart Page
@app.get("/cart", response_class=HTMLResponse)
def cart(request: Request):
    return templates.TemplateResponse("cart.html", {"request": request})


# Product Details Page
@app.get("/product", response_class=HTMLResponse)
def product(request: Request):
    try:
        products = list(
            product_collection.find().sort([
                ("placed_orders", -1),
                ("_id", -1)
            ]).limit(3)
        )
        for product in products:
            product["_id"] = str(product["_id"])

    except Exception as e:
        print(f"Error: {e}")
        products = []

    return templates.TemplateResponse("product.html", {"request": request, "products": products})


# Order Confirmation
@app.get("/address_OrderConfirm", response_class=HTMLResponse)
def confirm(request: Request):
    return templates.TemplateResponse("address_OrderConfirm.html", {"request": request})


# Receipt Page
@app.get("/receipt", response_class=HTMLResponse)
def receipt(request: Request):
    return templates.TemplateResponse("receipt.html", {"request": request})



#--------------------------------------------------API ENDPOINTS--------------------------------------------------
# Get all products (API)
@app.get("/products")
def get_products():
    products = list(product_collection.find())
    for product in products:
        product["_id"] = str(product["_id"])
    return products


# Add a product
@app.post("/products")
def add_product(product: Product):
    result = product_collection.insert_one(product.model_dump())
    return {"message": "Product added", "id": str(result.inserted_id)}


# Place an order
@app.post("/orders")
def place_order(order: Order):
    result = order_collection.insert_one(order.model_dump())
    return {"message": "Order placed", "orderId": str(result.inserted_id)}


async def send_order_email(order_details: dict):
    products_html = ""
    for product in order_details["products"]:
        products_html += f"""
        <tr>
            <td>{product['name']} - {product['category']}</td>
            <td>{product['quantity']}</td>
            <td>PKR {product['price'] * product['quantity']}/-</td>
        </tr>
        """
    
    customer = order_details["customerDetails"]

    html_content = f"""
        <h2>New Order Received - {order_details['orderNumber']}</h2>
        
        <h3>Customer Details:</h3>
        <p>Name: {customer['name']}</p>
        <p>Contact: {customer['contact']}</p>
        <p>Address: House {customer['house']}, Street {customer['street']}, Block {customer['block']}</p>
        <p>Area: {customer['area']}</p>
        <p>Landmark: {customer['landmark']}</p>
        <p>City: {customer['city']}</p>
        
        <h3>Order Details:</h3>
        <table border="1" cellpadding="5">
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Subtotal</th>
            </tr>
            {products_html}
            <tr>
                <td colspan="2">Shipping Cost</td>
                <td>PKR {order_details['shippingCost']}/-</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Total Amount</strong></td>
                <td><strong>PKR {order_details['totalAmount']}/-</strong></td>
            </tr>
        </table>
    """

    message = MessageSchema(
        subject = f"New Order Received - {order_details['orderNumber']}",
        recipients = ["umarayaz3321@gmail.com"],
        body = html_content,
        subtype = "html"
    )

    await fastMail.send_message(message)


# Save an Order
@app.post("/save-order")
async def save_order(request: Request):
    try:
        # Get order data from request body
        print("Received save-order request")
        order_data = await request.json()
        print(f"Order data received: {order_data}")
        
        # Generate unique order number using timestamp and random number
        timestamp = datetime.now().strftime('%Y%m%d%H%M')
        random_suffix = str(random.randint(1000, 9999))
        order_number = f"RN{timestamp}{random_suffix}"

        # Create order document
        order_doc = {
            "orderNumber": order_number,
            "customerDetails": order_data["addressDetails"],
            "products": order_data["orderDetails"]["cart"],
            "totalAmount": order_data["orderDetails"]["totalAmount"],
            "shippingCost": order_data["orderDetails"]["shippingCost"],
            "orderDate": datetime.now()
        }
        
        # Insert into orders collection
        result = order_collection.insert_one(order_doc)
        if not result.inserted_id:
            raise Exception("Failed to insert order")
        
        # Update products collection
        for product in order_data["orderDetails"]["cart"]:
            update_result = product_collection.update_one(
                {"name": product["name"]},
                {"$inc": {"placed_orders": product["quantity"]}}
            )
        
        try:
            await send_order_email(order_doc)
        except Exception as e:
            print(f"Email could not be sent: {e}")
        
        return {"status": "success", "orderNumber": order_number}
        
    except Exception as e:
        print(f"Error in save_order: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {"status": "error", "message": str(e)}