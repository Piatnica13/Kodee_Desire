from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(40), nullable=True, default="")
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(11), nullable=True, default="")
    email = db.Column(db.String(75), nullable=False)
    address = db.Column(db.String(50), nullable=True, default="")
    addresses = db.relationship('Address', backref='person', lazy=True, cascade="all, delete") 

    def __repr__(self):
        return f"{self.name}"


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    name = db.Column(db.String(40), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    street = db.Column(db.String(20), nullable=False)
    home = db.Column(db.String(20), nullable=False)
    flat = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f"<Address {self.name}, {self.city}, {self.street}>"


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Integer)
    concept = db.Column(db.String(20))
    category = db.Column(db.String(20))
    descriptions = db.Column(db.String(510))
    slug = db.Column(db.String(100), unique=True, nullable=False)
    images = relationship("Product_image", backref="product", lazy=True)
    
    def __init__(self, name, price, concept, category, descriptions, slug):
        self.name = name
        self.price = price
        self.concept = concept
        self.category = category
        self.descriptions = descriptions
        self.slug = slug
        

    def __repr__(self):
        return f"<{self.slug}>"

class Product_image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num = db.Column(db.Integer)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    img1 = db.Column(db.String(255), nullable=False)
    
    def __init__(self, num, product_id, img1):
        self.num = num
        self.product_id = product_id
        self.img1 = img1
    
    def __repr__(self):
        return f"<Image {self.product_id}>"