import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()
uri = "mongodb+srv://umar_23:wbKT57FN3p8gwUQ9@productsandorders.81fmwyz.mongodb.net/?retryWrites=true&w=majority&appName=ProductsAndOrders"
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")

    try:
        print("Fetching ecommerce dataset...")
        # Select database
        db = client["ecommerce"]
        print("Fetched!\n")
        
        # Collections
        print("Fetching collections...")
        product_collection = db["products"]
        order_collection = db["orders"]
        print("Fetched!\n")

    except Exception as e:
        print(f"An error occured: {e}")
except Exception as e:
    print(e)

