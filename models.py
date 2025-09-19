from pydantic import BaseModel
from typing import List

class Product(BaseModel):
    name: str
    price: float
    description: str
    imageUrl: str
    category: str
    collection: str
    smallImg01: str
    smallImg02: str
    smallImg03: str
    smallImg04: str
    placed_orders: int

class ProductInOrder(BaseModel):
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    products: List[ProductInOrder]
    totalPrice: float
    customerAddress: str
