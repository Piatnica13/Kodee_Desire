from app.models import db
from app.__init__ import create_app, create_oauth
from app.routes import add_admin
from app.init import allProducts

# Создание flask приложения
app = create_app()
app.logger.info("Flask-приложение создано.")

# OAuth google
oauth = create_oauth(app)

# Создание всех таблиц и добавление админа
with app.app_context():
    db.create_all()
    allProducts(db, app)
    add_admin()
    
if __name__ == '__main__':
    app.run()