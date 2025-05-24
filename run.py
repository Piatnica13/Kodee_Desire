from main import app, db, add_admin
from init import allProducts

#Запуск
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        allProducts()
        add_admin()
    app.logger.info("Запуск с run.")
    app.run()