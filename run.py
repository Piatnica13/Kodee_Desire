from main import app, db, add_admin
from init import allProducts

with app.app_context():
    db.create_all()
    allProducts()
    add_admin()

#Запуск
if __name__ == "__main__":
    app.run(debug=True)