from flask_sqlalchemy import SQLAlchemy

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