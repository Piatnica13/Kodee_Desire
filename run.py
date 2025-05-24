from main import app, db, add_admin
from init import allProducts
from models import Person, Product, Product_image, Address

#Запуск
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        allProducts()
        add_admin()
    app.logger.info("Запуск с run.")
    app.run()