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

# Serve HTML files (shop.html, etc.)
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/shop", response_class=HTMLResponse)
async def shop(request: Request):
    try:
        products = []
        async for product in product_collection.find():
            product["_id"] = str(product["_id"])
            products.append(product)
    except Exception as e:
        print(f"Error: {e}")
    return templates.TemplateResponse("shop.html", {"request": request, "products": products})

@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})

@app.get("/cart", response_class=HTMLResponse)
async def cart(request: Request):
    return templates.TemplateResponse("cart.html", {"request": request})

@app.get("/product")
async def product(request: Request):
    return templates.TemplateResponse("product.html", {"request": request})

@app.get("/confirm")
async def confirm(request: Request):
    return templates.TemplateResponse("confirm.html", {"request": request})

@app.get("/receipt")
async def receipt(request: Request):
    return templates.TemplateResponse("receipt.html", {"request": request})

# Get all products
@app.get("/products")
async def get_products():
    products = []
    async for product in product_collection.find():
        product["_id"] = str(product["_id"])  # Convert ObjectId to string
        products.append(product)
    return products

# Add a product
@app.post("/products")
async def add_product(product: Product):
    result = await product_collection.insert_one(product.model_dump())
    return {"message": "Product added", "id": str(result.inserted_id)}

# Place an order
@app.post("/orders")
async def place_order(order: Order):
    result = await order_collection.insert_one(order.model_dump())
    return {"message": "Order placed", "orderId": str(result.inserted_id)}
