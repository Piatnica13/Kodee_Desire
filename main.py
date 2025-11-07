from flask import Flask, render_template, request, redirect, session, flash, jsonify, send_from_directory, current_app
from flask_wtf import CSRFProtect
from flask_cors import CORS
from sqlalchemy.orm.attributes import flag_modified
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from functools import wraps
from app.models import db, Address, Person, Product, Product_image
from app.log import setup_logging
from app.forms import LoginForm, RegisterForm, ProfilMainPassForm, ProfilSplitForm, ProfilAddSplit, ProfilAddressForm
from app.init import allProducts
from app.admin import admin
from slugify import slugify
import os
import psycopg2

# Создание flask приложения
app = Flask(__name__)
app.logger.info("Flask-приложение создано.")

# Подключение .env файла
load_dotenv('password.env')
app.logger.info("Файл .env загружен.")

# Подключение базы данных
pyPassword = os.getenv("SQLITE")
# app.config['SQLALCHEMY_DATABASE_URI'] = pyPassword
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db' 


app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True
}

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.logger.info("Настройки базы данных заданы (POSTGRES).")

# Создание ключа
app.secret_key = os.getenv("SECRET_KEY")
app.logger.info(f"Секретный ключ загружен из .env.")

# Логи (log.py)
setup_logging(app)
app.logger.info("Логирование настроено.")

# Инициализация соединения
db.init_app(app) 
app.logger.info("База данных инициализирована.")

# Инициализация админ панели
admin.init_app(app)
app.logger.info("Админ панель инициализирована.")

# CSRF Безопасность
csrf = CSRFProtect(app)
app.logger.info("CSRF настроено")

# Cookie Безопасность
app.config.update(
    SESSION_COOKIE_SECURE=True,      # Только через HTTPS
    SESSION_COOKIE_HTTPONLY=True,    # JS не получит доступ к cookie
    SESSION_COOKIE_SAMESITE='Lax'    # Защита от CSRF
)
app.logger.info("Cookie настроено")

# IOS Безопасность
CORS(app, supports_credentials=True, origins=["https://kodee.kz"])


# Главный маршрут
@app.route('/')
def index():
    admin = session.get('admin')
    if admin:
        return render_template('index.html', admin=True)
    return render_template('index.html', admin=False)
    

# ПРОФИЛЬ
@app.route('/profil', methods=["POST", "GET"])
def profil():
    formSplit = ProfilSplitForm()
    formPass = ProfilMainPassForm()
    formAdd = ProfilAddSplit()
    formAddress = ProfilAddressForm()
    
    app.logger.debug("Обработка запроса к /profil.")

    errors = {}
    user_id = session.get('user_id')
    if not user_id:
        app.logger.warning("Попытка доступа к профилю без авторизации.")
        return redirect('/login')

    user = Person.query.get(int(user_id))
    if not user:
        app.logger.error(f"Пользователь с ID {user_id} не найден.")
        return redirect('/login')

    favorite_products = Product.query.filter(Product.id.in_(user.favourites)).all() 
    app.logger.debug(f"Избранные товары пользователя ID {user.id}: {[p.id for p in favorite_products]}")

    if request.method == "POST":
        try:
            if "update_info" in request.form:
                update_info(user)
                app.logger.info(f"Пользователь ID {user.id} обновил личную информацию.")

            elif "update_password" in request.form:
                update_password(user, errors, favorite_products)
                app.logger.info(f"Пользователь ID {user.id} попытался сменить пароль.")

            elif "work_with_address" in request.form:
                work_with_address(user)
                app.logger.info(f"Пользователь ID {user.id} изменил адреса.")

            db.session.commit()
            app.logger.debug(f"Изменения пользователя ID {user.id} успешно сохранены в БД.")
            return render_template("profil.html", errors=errors, user=user, favorite_products=favorite_products, formSplit=formSplit, formPass=formPass, formAdd=formAdd, formAddress=formAddress)

        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Ошибка при сохранении данных профиля пользователя ID {user.id}: {str(e)}")
            return "Ошибка обновления данных"

    return render_template("profil.html", user=user, errors=errors, favorite_products=favorite_products, formSplit=formSplit, formPass=formPass, formAdd=formAdd, formAddress=formAddress)

# Обновление информации
def update_info(user: Person) -> None:
    name = request.form.get("name")
    last_name = request.form.get("last_name", "")
    phone = request.form.get("phone", "")
    email = request.form.get("email")
    address = request.form.get("address", "")

    user.name = name.strip() if name else user.name
    user.email = email.strip() if email else user.email
    user.last_name = last_name.strip() if last_name else user.last_name
    user.phone = phone.strip() if phone else user.phone
    user.address = address.strip() if address else user.address

    app.logger.debug(f"Обновлена информация для пользователя ID {user.id}: имя={user.name}, email={user.email}")

# Обновление пароля
def update_password(user: Person, errors, favorite_products):
    new_pass = request.form.get("newPass")
    re_new_pass = request.form.get("reNewPass")

    if new_pass and new_pass == re_new_pass and len(new_pass) >= 6:
        heshed_pass = generate_password_hash(new_pass)
        user.password = heshed_pass
        app.logger.debug(f"Пароль пользователя ID {user.id} успешно обновлён.")
    else:
        errors['comparisons'] = "Ошибка, пароли не совпадают или пароль меньше 6 символов"
        flash("пароли не свопадают или пароль состоит менее чем из 6 символов", "error")
        app.logger.warning(f"Ошибка при смене пароля у пользователя ID {user.id}: несовпадение или короткий пароль.")

    return render_template("profil.html", user=user, errors=errors, favorite_products=favorite_products)

# Работа с адресами
def work_with_address(user: Person) -> None:
    deleted_addresses = request.form.get("deleted_addresses")
    deleted_ids = [int(id) for id in deleted_addresses.split(",") if id.isdigit()]

    if deleted_ids:
        Address.query.filter(Address.id.in_(deleted_ids), Address.person_id == user.id).delete(synchronize_session=False)
        app.logger.info(f"Пользователь ID {user.id} удалил адреса: {deleted_ids}")
    else:
        app.logger.debug(f"Нет адресов для удаления у пользователя ID {user.id}.")

    addressFromForm = request.form.get("addresses")
    if addressFromForm is not None:
        user.address = addressFromForm
        app.logger.debug(f"Пользователь ID {user.id} установил основной адрес: {addressFromForm}")
    else:
        user.address = ""
        app.logger.debug(f"Пользователь ID {user.id} очистил основной адрес.")
#

# КОРЗИНА
# Маршрут для корзины
@app.route('/basket', methods=["GET", "POST"])
def basket():
    form = ProfilAddSplit()
    app.logger.debug("Обработка запроса к /basket.")

    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')
    user = Person.query.get(int(user_id))
    if not user:
        app.logger.error(f"Пользователь с ID {user_id} не найден.")
        return redirect('/login')

    products = []
    for i in user.basket:
        product = Product.query.filter_by(id=i[0]).first()
        if product:
            products.append(product)
        else:
            app.logger.warning(f"Товар с ID {i[0]} из корзины не найден в базе.")

    app.logger.info(f"Пользователь ID {user.id} открыл корзину. Всего товаров: {len(products)}")
    return render_template('basket.html', basket=products, user=user, form=form)

# Добавление товара в корзину
@app.route('/add_basket', methods=['POST', 'OPTIONS'])
def add_basket():
    if request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /add_basket.")
        return jsonify(), 200
    elif request.method == 'POST':
        app.logger.debug("Обработка запроса к /add_basket.")

        try:
            data = request.get_json()
            color = data.get('color')
            size = data.get('size')
            material = data.get('material')
            product_id = data.get('product_id')

            app.logger.debug(f"Данные из запроса: product_id={product_id}, color={color}, size={size}, material={material}")

            user_id = session.get('user_id')
            if not user_id:
                app.logger.warning("Попытка добавить товар в корзину без авторизации.")
                return jsonify({"success": False, "error": "Пользователь не авторизован"})

            user = Person.query.get(int(user_id))
            if not user:
                app.logger.error(f"Пользователь с ID {user_id} не найден.")
                return jsonify({"success": False, "error": "Пользователь не найден"})

            for i in user.basket:
                if product_id == i[0]:
                    app.logger.info(f"Товар ID {product_id} уже в корзине пользователя ID {user.id}.")
                    return jsonify({"success": False, "error": "Товар уже в корзине"})

            user.basket.append([product_id, color, size, material])
            flag_modified(user, "basket")
            db.session.commit()

            app.logger.info(f"Пользователь ID {user.id} добавил товар ID {product_id} в корзину.")
            return jsonify({"success": True, "message": "Товар успешно добавлен в корзину"})

        except Exception as e:
            app.logger.error(f"Ошибка при добавлении товара в корзину: {str(e)}")
            return jsonify({"success": False, "error": "Ошибка сервера"})

# Удаление товара из корзины
@app.route('/delete_basket', methods=['POST', 'OPTIONS'])
def delete_basket():
    if request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /delete_basket.")
        return jsonify(), 200
    elif request.method == 'POST':
        app.logger.debug("Обработка запроса к /delete_basket.")

        try:
            data = request.get_json()
            product_id = data.get("product_id")
            app.logger.debug(f"Получен product_id для удаления: {product_id}")

            user_id = session.get("user_id")
            if not user_id:
                app.logger.warning("Попытка удалить товар из корзины без авторизации.")
                return jsonify({"success": False, "error": "Пользователь не авторизован"})

            user = Person.query.filter_by(id=user_id).first()
            if not user:
                app.logger.error(f"Пользователь с ID {user_id} не найден.")
                return jsonify({"success": False, "error": "Пользователь не найден"})

            old_len = len(user.basket)
            user.basket = [item for item in user.basket if item[0] != product_id]
            db.session.add(user)
            db.session.commit()
            new_len = len(user.basket)

            if new_len < old_len:
                app.logger.info(f"Пользователь ID {user.id} удалил товар ID {product_id} из корзины.")
            else:
                app.logger.warning(f"Товар ID {product_id} не найден в корзине пользователя ID {user.id}.")

            return jsonify({"success": True, "message": "Товар успешно удален"})

        except Exception as e:
            app.logger.error(f"Ошибка при удалении товара из корзины: {str(e)}")
            return jsonify({"success": False, "error": "Ошибка сервера"})
#

# ДОБАВЛЕНИЕ АДРЕСА
@app.route('/add_address', methods=["POST", "OPTIONS"])
def addAddress():
    if request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /add_address.")
        return jsonify(), 200
    elif request.method == 'POST':
        app.logger.debug("Обработка запроса на добавление адреса.")

        try:
            data = request.get_json()
            name = data.get("name")
            city = data.get("city")
            street = data.get("street")
            home = data.get("home")
            flat = data.get("flat")
            person_id = session.get("user_id")

            if not person_id:
                app.logger.warning("Добавление адреса без авторизации.")
                return jsonify({"success": False, "error": "Пользователь не авторизован"})

            if not city or not street or not home:
                app.logger.warning("Не все обязательные поля заполнены при добавлении адреса.")
                return jsonify({"success": False, "error": "Не все обязательные поля заполнены"})

            new_address = Address(name=name, city=city, street=street, home=home, flat=flat, person_id=person_id)
            db.session.add(new_address)
            db.session.commit()
            app.logger.info(f"Добавлен новый адрес для пользователя ID {person_id}.")

            address_count = Address.query.filter_by(person_id=person_id).count()
            if address_count == 1:
                user = Person.query.get(person_id)
                user.address = f"г.{new_address.city} ул.{new_address.street} д.{new_address.home} кв.{new_address.flat}"
                db.session.commit()
                app.logger.debug(f"Основной адрес установлен для пользователя ID {person_id}.")

            return jsonify({
                "success": True,
                "message": "Адрес успешно добавлен",
                "address": f"г.{new_address.city} ул.{new_address.street} д.{new_address.home} кв.{new_address.flat}"
            })

        except Exception as e:
            app.logger.error(f"Ошибка при добавлении адреса: {str(e)}")
            return jsonify({"success": False, "error": "Ошибка сервера"})


# ДОБАВЛЕНИЕ ИЛИ УДАЛЕНИЕ ИЗБРАННОГО
@app.route('/add_favorite', methods=['POST', 'OPTIONS'])
def add_favorite():
    if request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /add_favorite.")
        return jsonify(), 200
    elif request.method == 'POST':
        app.logger.debug("Обработка запроса на добавление в избранное.")

        try:
            data = request.get_json()
            user_id = session.get('user_id')
            if not user_id:
                app.logger.warning("Попытка работы с избранным без авторизации.")
                return jsonify({"success": False, "error": "Пользователь не авторизован"})

            user = Person.query.get(int(user_id))
            product_id = data.get("product_id")

            if not product_id:
                app.logger.warning("Нет product_id в запросе избранного.")
                return jsonify({"success": False, "error": "Товар не найден"})

            if product_id in user.favourites:
                user.favourites = [pid for pid in user.favourites if pid != product_id]
                message = "Товар удален из избранных"
                app.logger.info(f"Товар ID {product_id} удалён из избранного пользователя ID {user_id}.")
            else:
                favs = user.favourites
                favs = favs + [product_id]
                user.favourites = favs

                message = "Товар добавлен в избранные"
                app.logger.info(f"Товар ID {product_id} добавлен в избранное пользователя ID {user_id}.")

            db.session.add(user)
            db.session.commit()

            return jsonify({"success": True, "message": message})

        except Exception as e:
            app.logger.error(f"Ошибка при работе с избранным: {str(e)}")
            return jsonify({"success": False, "error": "Ошибка сервера"})    


# ПЕРЕДАЧА ВСЕХ ТОВАРОВ В JS
@app.route("/AllProductJS")
def AllProductJS():
    all_products = Product.query.all()

    product_list = []
    for product in all_products:
        product_list.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "concept": product.concept,
            "category": product.category,
            "slug": product.slug,
            "image": f"/static/image/productImgs/{product.slug}/img1.webp"
        })

    return jsonify(product_list)


# ПОИСК
@app.route("/search")
def search():
    app.logger.debug("Обработка запроса поиска.")

    try:
        query = request.args.get("query", "").strip()
        if not query:
            app.logger.debug("Пустой поисковый запрос.")
            return jsonify([])

        products = Product.query.filter(
            (Product.id.ilike(f"%{query}%")) |
            (Product.name.ilike(f"%{query.capitalize()}%"))
        ).limit(10).all()

        app.logger.info(f"Найдено {len(products)} товаров по запросу '{query}'.")

        results = [{
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "slug": p.slug,
            "image": p.image()
        } for p in products]

        return jsonify(results)
    except Exception as e:
        app.logger.error(f"Ошибка при выполнении поиска: {str(e)}")
        return jsonify([])
#


# МАГАЗИН
@app.route('/shop')
def shop():
    products = Product.query.limit(4).all()
    products_json = []
    for p in products:
        products_json.append({
            "@type": "Product",
            "name": p.name,
            "image": p.image(),  # должен возвращать строку
            "description": p.descriptions,
            "brand": {
                "@type": "Brand",
                "name": "KoDee Desire"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "KZT",
                "price": p.price,
                "availability": "https://schema.org/InStock"
            }
        })

    app.logger.debug("Открыта страница магазина.")
    return render_template("shop.html", products_json=products_json)



# КОНТАКТЫ
@app.route('/contact')
def contact():
    app.logger.debug("Открыта страница контактов.")
    return render_template('contact.html')


# СПРАВКА
@app.route('/help/<theme>')
def help(theme):
    app.logger.debug("Открыта страница справки.")
    return render_template('help.html', theme=theme)


# ИНДИВИДУАЛЬНЫЙ ЗАКАЗ
@app.route('/individual')
def individual_order():
    app.logger.debug("Открыта страница индивидуального заказа.")
    return render_template('individual.html')


# РЕГИСТРАЦИЯ
@app.route('/register', methods=['POST', 'GET', 'OPTIONS'])
def register():
    form = RegisterForm()
    errors = {}
    if request.method == "POST":
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        emails = db.session.query(Person.email).all()
        emails = [email[0] for email in emails]

        if len(password) < 6:
            errors['len'] = "Пароль меньше 6 символов"
            app.logger.warning("Регистрация не удалась: короткий пароль.")
            return render_template('register.html', errors=errors, form=form)

        if email in emails:
            errors['have'] = "Аккаунт с данным Email уже зарегистрирован"
            app.logger.warning(f"Регистрация не удалась: Email {email} уже используется.")
            return render_template('register.html', errors=errors, form=form)

        hashed_password = generate_password_hash(password)
        person = Person(name=name, email=email, password=hashed_password)

        try:
            db.session.add(person)
            db.session.commit()
            app.logger.info(f"Успешная регистрация: {email}")

            user = Person.query.filter_by(email=email).first()
            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                app.logger.debug(f"Пользователь {email} вошел после регистрации.")
            return render_template("index.html", messageForReg=True)
        except Exception as e:
            app.logger.error(f"Ошибка при регистрации пользователя {email}: {str(e)}")
            return render_template("index.html", messageNoReg=True)
    elif request.method == "GET":
        app.logger.debug("Открыта страница регистрации.")
        return render_template('register.html', errors=errors, messageNoReg=True, form=form)
    elif request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /register.")
        return jsonify(), 200



# ВХОД В АККАУНТ
@app.route('/login', methods=['POST', 'GET', 'OPTIONS'])
def login():
    form = LoginForm()
    errors = {}
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")

        if not email or not password:
            errors["error"] = "Ошибка, обязательные поля пустые"
            app.logger.warning("Попытка входа с пустыми полями.")
        if len(password) < 6:
            errors["len"] = "Ошибка, длина пароля меньше 6 символов"
            app.logger.warning("Попытка входа с коротким паролем.")

        user = Person.query.filter_by(email=email).first()

        if email == admin_email and password == admin_password:
            session['admin'] = True
            if user:
                session['user_id'] = user.id
                app.logger.info(f"Администратор {email} вошел в систему.")
                return redirect("/admin")
            else:
                app.logger.warning("Попытка входа администратора, но пользователь не найден.")
                errors["notfound"] = "Аккаунт не найден"
                return render_template("login.html", errors=errors, form=form)

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            app.logger.info(f"Пользователь {email} успешно вошел.")
            return render_template("index.html", messageForLog=True, form=form)
        else:
            errors["comparisons"] = "Ошибка ввода, неправильно введен пароль или email"
            app.logger.warning(f"Неудачная попытка входа: {email}")
            return render_template("login.html", errors=errors, messageForNoLog=True, form=form)
    elif request.method == 'GET':
        app.logger.debug("Открыта страница входа.")
        return render_template('login.html', errors=errors, messageForNoLog=True, form=form)
    elif request.method == 'OPTIONS':
        app.logger.debug("Получен OPTIONS запрос на /login.")
        return jsonify(), 200


# ВЫХОД ИЗ АККАУНТА
@app.route('/logout')
def logout():
    user_id = session.get('user_id')
    admin = session.get('admin')

    session.pop('user_id', None)
    session.pop('admin', None)

    app.logger.info(f"Пользователь ID {user_id} {'(админ)' if admin else ''} вышел из аккаунта.")
    return redirect('/')
#

# СОЗДАЕМ АДМИН АККАУНТ
def add_admin():
    admin = Person.query.filter_by(email=os.getenv("ADMIN_EMAIL")).first()
    if not admin:
        new_admin = Person(
            name="admin",
            password=generate_password_hash(os.getenv("ADMIN_PASSWORD")),
            email=os.getenv("ADMIN_EMAIL")
        )
        try:
            db.session.add(new_admin)
            db.session.commit()
            app.logger.info("Создан новый админ аккаунт.")
        except Exception as e:
            app.logger.error(f"Ошибка при создании админа: {str(e)}")
    else:
        app.logger.debug("Админ уже существует, создание не требуется.")


# ПРОВЕРКА НА АДМИН ДОСТУП
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin'):
            app.logger.warning("Попытка доступа к админке без прав.")
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/panel')
@admin_required
def admin_panel():
    return render_template('admin.html')

# Добавление изображений в созданную папку, админ
@app.route('/admin/add_imgs', methods=['POST'])
@admin_required
def add_imgs():
    try:
        name = slugify(request.form.get('productName'))
        base_path = os.path.join(current_app.root_path, 'static', 'image', 'productImgs', name)
        
        os.makedirs(base_path, exist_ok=True)
        
        img1 = request.files.get('img1')
        img2 = request.files.get('img2')
        img3 = request.files.get('img3')
        img4 = request.files.get('img4')
        
        if img1:
            img1.save(os.path.join(base_path, "img1.webp"))
        if img2:
            img2.save(os.path.join(base_path, "img2.webp"))
        if img3:
            img3.save(os.path.join(base_path, "img3.webp"))
        if img4:
            img4.save(os.path.join(base_path, "img4.webp"))
        
        app.logger.info(f"Файлы {img1} {img2} {img3} {img4} успешно добавлены в папку {base_path}")
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({'error': f"Ошибка с файлами {e}"})

# СТРАНИЦА ПРОДУКТА
@app.route('/product/<slug>')
def product(slug):
    user_id = session.get('user_id') or ''
    product = Product.query.filter_by(slug=slug).first()

    if user_id != '':
        person = Person.query.get(int(user_id)) or ''

        if person == '':
            return render_template('product.html', product=product, user='', address='', favarite='')

        if not product:
            app.logger.warning(f"Продукт со slug '{slug}' не найден.")
            return "Товар не найден", 404

            
        address = Address.query.filter_by(person_id=person.id).first()
        app.logger.debug(f"Загружена страница продукта '{slug}' пользователем {person.email}")

        return render_template('product.html', product=product, user=person, address=address, favarite=person.favourites)
    else:
        return render_template('product.html', product=product, user='', address='', favarite='')


# ВЫВОД ПРОДУКТОВ
@app.route('/api/products')
def get_product():
    products = Product.query.all()
    product_data = [
        {
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "concept": p.concept,
        "category": p.category,
        "image": p.image(),
        "slug": p.slug
        }
        for p in products
    ]
    return jsonify(product_data)


# ВСЕ СЕРВЕРНЫЕ МОМЕНТЫ
@app.after_request
def apply_security_headers(response):
    # Безопасность
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'DENY'
    
    # Если хочешь явно указать CORS-заголовки вручную (иногда нужно)
    response.headers['Access-Control-Allow-Origin'] = 'https://kodee.kz'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    
    return response

@app.route('/.well-known/security.txt')
def security_txt():
    return send_from_directory('static/.well-known', 'security.txt')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

# ОБРАБОТКА ОШИБОК
@app.errorhandler(400)
def bad_request(error):
    app.logger.error(f"Ошибка 400: {error}")
    return render_template('error.html', code=400, title="Некорректный запрос", message="Похоже, вы отправили неправильные данные."), 400

@app.errorhandler(401)
def unauthorized(error):
    app.logger.error(f"Ошибка 401: {error}")
    return render_template('error.html', code=401, title="Не авторизован", message="Доступ доступен только после входа."), 401

@app.errorhandler(403)
def forbidden(error):
    app.logger.error(f"Ошибка 403: {error}")
    return render_template('error.html', code=403, title="Доступ запрещён", message="У вас нет прав на просмотр этой страницы."), 403

@app.errorhandler(404)
def page_not_found(error):
    app.logger.error(f"Ошибка 404: {error}")
    return render_template('error.html', code=404, title="Страница не найдена", message="Упс! Мы не смогли найти такую страницу."), 404

@app.errorhandler(405)
def method_not_allowed(error):
    app.logger.error(f"Ошибка 405: {error}")
    return render_template('error.html', code=405, title="Метод не разрешён", message="Этот метод не поддерживается для данного ресурса."), 405

@app.errorhandler(500)
def internal_server_error(error):
    app.logger.error(f"Ошибка 500: {error}")
    return render_template('error.html', code=500, title="Ошибка сервера", message="Что-то пошло не так на сервере. Повторите попытку"), 500


# Создание всех таблиц и добавление админа
with app.app_context():
    db.create_all()
    allProducts(db, app)
    add_admin()
if __name__ == '__main__':
    app.run(debug=True)