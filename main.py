from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from models import Product, Order
from database import product_collection, order_collection
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import os

app = FastAPI()

# Serve static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Home Page
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Shop Page (fetch products from DB)
@app.get("/shop", response_class=HTMLResponse)
def shop(request: Request):
    try:
        products = list(product_collection.find())
        for product in products:
            product["_id"] = str(product["_id"])  # Convert ObjectId to string
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
    return templates.TemplateResponse("product.html", {"request": request})

# Order Confirmation
@app.get("/confirm", response_class=HTMLResponse)
def confirm(request: Request):
    return templates.TemplateResponse("confirm.html", {"request": request})

# Receipt Page
@app.get("/receipt", response_class=HTMLResponse)
def receipt(request: Request):
    return templates.TemplateResponse("receipt.html", {"request": request})



# --- API Endpoints ---

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