from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session, flash, jsonify
from sqlalchemy.orm.attributes import flag_modified
from models import db, Address, Person, Product, Product_image
from log import setup_logging
from slugify import slugify
from dotenv import load_dotenv
from functools import wraps

import os
import json


# Создание flask приложения
app = Flask(__name__)
app.logger.info("Flask-приложение создано.")

# Подключение .env файла
load_dotenv('Kodee_Desire/password.env')
app.logger.info("Файл .env загружен.")

# скрипт для pythonanywhere
# Подключение базы данных
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
#     username="Piatnica13",
#     password="Dima2014",
#     hostname="Piatnica13.mysql.pythonanywhere-services.com",
#     databasename="Piatnica13$Kodee_Desire",
# )
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db' 

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.logger.info("Настройки базы данных заданы (Lite).")

# Создание ключа
app.secret_key = os.getenv("SECRET_KEY")
app.logger.info(f"Секретный ключ загружен из .env.")

# Логи (log.py)
setup_logging(app)
app.logger.info("Логирование настроено.")

db.init_app(app)  # Инициализация соединения
app.logger.info("База данных инициализирована.")

# Главный маршрут
@app.route('/')
def index():
    return render_template('index.html')

# ПРОФИЛЬ
# ПРОФИЛЬ
@app.route('/profil', methods=["POST", "GET"])
def profil():
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
            return render_template("profil.html", errors=errors, user=user, favorite_products=favorite_products)

        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Ошибка при сохранении данных профиля пользователя ID {user.id}: {str(e)}")
            return "Ошибка обновления данных"

    return render_template("profil.html", user=user, errors=errors, favorite_products=favorite_products)

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
    return render_template('basket.html', basket=products, user=user)

# Добавление товара в корзину
@app.route('/add_basket', methods=['POST'])
def add_basket():
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
@app.route('/delete_basket', methods=['POST'])
def delete_basket():
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
@app.route('/add_address', methods=["POST"])
def addAddress():
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
@app.route('/add_favorite', methods=['POST'])
def add_favorite():
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
            user.favourites.append(product_id)
            message = "Товар добавлен в избранные"
            app.logger.info(f"Товар ID {product_id} добавлен в избранное пользователя ID {user_id}.")

        db.session.add(user)
        db.session.commit()

        return jsonify({"success": True, "message": message})

    except Exception as e:
        app.logger.error(f"Ошибка при работе с избранным: {str(e)}")
        return jsonify({"success": False, "error": "Ошибка сервера"})


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
    app.logger.debug("Открыта страница магазина.")
    return render_template('shop.html')


# КОНТАКТЫ
@app.route('/contact')
def contact():
    app.logger.debug("Открыта страница контактов.")
    return render_template('contact.html')


# РЕГИСТРАЦИЯ
@app.route('/register', methods=['POST', 'GET'])
def register():
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
            return render_template('register.html', errors=errors)

        if email in emails:
            errors['have'] = "Аккаунт с данным Email уже зарегистрирован"
            app.logger.warning(f"Регистрация не удалась: Email {email} уже используется.")
            return render_template('register.html', errors=errors)

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
    else:
        app.logger.debug("Открыта страница регистрации.")
        return render_template('register.html', errors=errors, messageNoReg=True)


# ВХОД В АККАУНТ
@app.route('/login', methods=['POST', 'GET'])
def login():
    errors = {}
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")
        app.logger.info(f"admin_email: {admin_email}, admin_password: {admin_password}")

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
                return redirect("/admin/deshboard")
            else:
                app.logger.warning("Попытка входа администратора, но пользователь не найден.")
                errors["notfound"] = "Аккаунт не найден"
                return render_template("login.html", errors=errors)

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            app.logger.info(f"Пользователь {email} успешно вошел.")
            return render_template("index.html", messageForLog=True)
        else:
            errors["comparisons"] = "Ошибка ввода, неправильно введен пароль или email"
            app.logger.warning(f"Неудачная попытка входа: {email}")
            return render_template("login.html", errors=errors, messageForNoLog=True)
    else:
        app.logger.debug("Открыта страница входа.")
        return render_template('login.html', errors=errors, messageForNoLog=True)


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


# АДМИН ПАНЕЛЬ
@app.route('/admin/deshboard')
@admin_required
def admin_deshboard():
    app.logger.info("Админ вошел в админку.")
    return render_template('admin.html')


# СТРАНИЦА ПРОДУКТА
@app.route('/product/<slug>')
def product(slug):
    user_id = session.get('user_id')
    product = Product.query.filter_by(slug=slug).first()

    if user_id:
        person = Person.query.get(int(user_id)) or ''

        if not product:
            app.logger.warning(f"Продукт со slug '{slug}' не найден.")
            return "Товар не найден", 404

        address = Address.query.filter_by(person_id=person.id).first()
        app.logger.debug(f"Загружена страница продукта '{slug}' пользователем {person.email}")

        return render_template('product.html', product=product, user=person, address=address, favarite=person.favourites)
    else:
        return render_template('product.html', product=product, user='', address='', favarite='')


# ДОБАВЛЕНИЕ ВСЕЙ ПРОДУКЦИИ В БД
def addProducts(product: Product):
    with app.app_context():
        chekProduct = Product.query.filter_by(name=product.name).first()
        if chekProduct:
            app.logger.debug(f"Продукт '{product.name}' уже есть в базе.")
            return

        try:
            db.session.add(product)
            db.session.commit()
            app.logger.info(f"Добавлен продукт: {product.name}")
        except Exception as e:
            app.logger.error(f"Ошибка при добавлении продукта '{product.name}': {str(e)}")
            return

        try:
            imagePak1 = Product_image(1, product.id, f"/static/image/productImgs/{product.slug}/img1.jpg")
            imagePak2 = Product_image(2, product.id, f"/static/image/productImgs/{product.slug}/img2.jpg")
            imagePak3 = Product_image(3, product.id, f"/static/image/productImgs/{product.slug}/img3.jpg")
            imagePak4 = Product_image(4, product.id, f"/static/image/productImgs/{product.slug}/img4.jpg")

            db.session.add_all([imagePak1, imagePak2, imagePak3, imagePak4])
            db.session.commit()
            app.logger.info(f"Изображения для продукта '{product.name}' успешно добавлены.")
        except Exception as e:
            app.logger.error(f"Ошибка при добавлении изображений для продукта '{product.name}': {str(e)}")


addProducts(Product(name="Кулон «Бесконечность»", price=28500, concept="Мир и свобода", category="Кулон", descriptions="Кулон «Бесконечность» - Символ бесконечности отражает постоянство, силу духа и неограниченные возможности. Этот знак напоминает, что в мире нет границ для тех, кто верит в себя. Он поможет своему владельцу обрести гармонию, мудрость и вдохновение на новые достижения.", slug=slugify("Бесконечность")))
addProducts(Product(name="Кулон «Голубь»", price=30500, concept="Мир и свобода", category="Кулон", descriptions="Кулон «Голубь» - Голубь испокон веков является символом мира, любви и чистоты. Он приносит в жизнь спокойствие и умиротворение, охраняет семейное счастье и дарит надежду. Этот кулон подойдет тем, кто стремится к гармонии и свету в своём сердце.", slug=slugify("Голубь")))
addProducts(Product(name="Кулон «Бесконечность love»", price=31500, concept="Любовь и романтика", category="Кулон", descriptions="Кулон «Бесконечность love» - Это не просто знак бесконечности, а символ вечной любви, которая выходит за границы времени. Такой кулон станет напоминанием о самом дорогом человеке, об истинных чувствах, не знающих преград.", slug=slugify("Бесконечность love")))
addProducts(Product(name="Кулон «Бриллиант»", price=33000, concept="Сила и успех", category="Кулон", descriptions="Кулон «Бриллиант» - Бриллиант олицетворяет чистоту, твёрдость характера и уникальность. Он символизирует успех, изящество и внутреннюю силу. Этот кулон подчеркнёт вашу индивидуальность и поможет раскрыть природное сияние души.", slug=slugify("Бриллиант")))
addProducts(Product(name="Кулон «Пульс»", price=33000, concept="Любовь и романтика", category="Кулон", descriptions="Кулон «Пульс» - Символ жизни, энергии и постоянного движения. Этот кулон напоминает о важности каждого момента и о том, что жизнь — это ритм, который создаём мы сами. Подходит для тех, кто стремится к развитию и уверенно идёт вперёд.", slug=slugify("Пульс")))
addProducts(Product(name="Кулон «Пацифик»", price=33000, concept="Мир и свобода", category="Кулон", descriptions="Кулон «Пацифик» - Символ свободы, мира и душевного равновесия. Пацифик несёт в себе идею гармонии и спокойствия. Этот кулон подойдёт тем, кто ценит жизнь во всех её проявлениях и стремится к добру.", slug=slugify("Пацифик")))
addProducts(Product(name="Кулон «Клевер»", price=33000, concept="Жизнь и процветание", category="Кулон", descriptions="Кулон «Клевер» - Четырёхлистный клевер — это талисман удачи, счастья и благополучия. Каждый его лепесток несёт особый смысл: надежду, веру, любовь и удачу. Такой кулон поможет привлечь в жизнь положительные перемены.", slug=slugify("Клевер")))
addProducts(Product(name="Кулон «Горы»", price=33500, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Горы» - Горы символизируют силу, стойкость и величие духа. Они напоминают о том, что любые вершины достижимы, если верить в себя. Этот кулон подойдёт тем, кто стремится к высотам и не боится покорять новые рубежи.", slug=slugify("Горы")))
addProducts(Product(name="Кулон «Дерево»", price=33500, concept="Жизнь и процветание", category="Кулон", descriptions="Кулон «Дерево» - Древо жизни — символ мудрости, семейных уз и духовного роста. Оно соединяет прошлое, настоящее и будущее, придаёт стойкость и внутренний баланс. Этот кулон поможет обрести гармонию и укрепить связь с корнями.", slug=slugify("Дерево")))
addProducts(Product(name="Кулон «Крестик»", price=34000, concept="Духовность и вера", category="Кулон", descriptions="Кулон «Крестик» - Крест — это мощный символ веры, защиты и духовной силы. Он несёт в себе смысл преодоления трудностей, надежды и внутреннего света. Такой кулон подойдёт тем, кто ищет опору и гармонию в жизни.", slug=slugify("Крестик")))
addProducts(Product(name="Кулон «Звезда Давида»", price=34000, concept="Духовность и вера", category="Кулон", descriptions="Кулон «Звезда Давида» - Этот символ несёт в себе глубокую мудрость и защиту. Шестиконечная звезда олицетворяет равновесие между духовным и материальным, соединение небесного и земного. Кулон подойдёт тем, кто стремится к внутреннему балансу и познанию себя.", slug=slugify("Звезда Давида")))
addProducts(Product(name="Кулон «Корона»", price=34500, concept="Сила и успех", category="Кулон", descriptions="Кулон «Корона» - Корона — это знак власти, силы и благородства. Она символизирует лидерство, достоинство и успех. Этот кулон подчеркнёт вашу уверенность и поможет раскрыть внутренний потенциал.", slug=slugify("Корона")))
addProducts(Product(name="Кулон «Сердце контур»", price=35000, concept="Любовь и романтика", category="Кулон", descriptions="Кулон «Сердце контур» - Лаконичный и изящный символ любви и искренних чувств. Этот кулон подойдёт тем, кто хочет носить с собой напоминание о тёплых эмоциях, важных людях и романтических моментах.", slug=slugify("Сердце контур")))
addProducts(Product(name="Кулон «Сердце пульс»", price=35500, concept="Любовь и романтика", category="Кулон", descriptions="Кулон «Сердце пульс» - Объединение символа сердца и пульса создаёт особенный знак, который отражает страсть, энергию и силу любви. Этот кулон станет напоминанием о том, что настоящие чувства делают нашу жизнь ярче.", slug=slugify("Сердце пульс")))
addProducts(Product(name="Кулон «Пустышка»", price=35500, concept="Любовь и семья", category="Кулон", descriptions="Кулон «Пустышка» – трогательный символ детства, нежности и заботы. Этот миниатюрный кулон напоминает о самых светлых моментах жизни, первых годах малыша, безграничной любви родителей и семейном тепле. Он станет особенным украшением для молодых мам, заботливых бабушек или тех, кто хочет сохранить в сердце теплые воспоминания о детстве.", slug=slugify("Пустышка")))
addProducts(Product(name="Кулон «Мальчик»", price=36000, concept="Любовь и семья", category="Кулон", descriptions="Кулон «Мальчик» - Этот кулон символизирует защиту и любовь к сыну, брату или любимому человеку. Он олицетворяет заботу, теплоту и радость, связанную с семьёй и детством.", slug=slugify("Мальчик")))
addProducts(Product(name="Кулон «Девочка»", price=36000, concept="Любовь и семья", category="Кулон", descriptions="Кулон «Девочка» - Очаровательный кулон, который станет символом любви к дочери, сестре или подруге. Он напоминает о нежности, счастье и бесконечной связи между близкими.", slug=slugify("Девочка")))
addProducts(Product(name="Кулон «Солнце»", price=36000, concept="Природа", category="Кулон", descriptions="Кулон «Солнце» - Солнце — источник жизни, тепла и света. Этот кулон заряжает энергией, приносит радость и помогает раскрыть внутренний потенциал. Он подойдёт тем, кто стремится быть ярким и вдохновлять окружающих.", slug=slugify("Солнце")))
addProducts(Product(name="Кулон «Крыло»", price=37000, concept="Мир и свобода", category="Кулон", descriptions="Кулон «Крыло» - Крыло символизирует свободу, лёгкость и стремление к мечте. Этот кулон вдохновляет на новые свершения и напоминает, что каждый человек способен подняться выше и достичь желаемого.", slug=slugify("Крыло")))
addProducts(Product(name="Кулон «Роза ветров»", price=37500, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Роза ветров» - Символ поиска пути, приключений и внутреннего компаса. Этот кулон подойдёт тем, кто любит путешествия, новые открытия и всегда следует за своими мечтами.", slug=slugify("Роза ветров")))
addProducts(Product(name="Кулон «Ангел»", price=37500, concept="Духовность и вера", category="Кулон", descriptions="Кулон «Ангел» - Ангел — символ защиты, надежды и божественного покровительства. Этот кулон напоминает о том, что рядом всегда есть поддержка, а добро и вера помогают преодолеть любые трудности.", slug=slugify("Ангел")))
addProducts(Product(name="Кулон «Ракетка»", price=37500, concept="Спорт", category="Кулон", descriptions="Кулон «Ракетка» – Для тех, кто живёт спортом и не боится вызовов. Символ энергии, упорства и стремления к победе. Пусть этот кулон напоминает тебе о страсти к игре и стремлении всегда идти вперёд!", slug=slugify("Ракетка")))
addProducts(Product(name="Кулон «Лапка»", price=38000, concept="Любовь к животным", category="Кулон", descriptions="Кулон «Лапка» – Маленький символ большой любви к животным. Этот кулон подойдёт тем, кто ценит искренность, дружбу и преданность. Пусть он станет напоминанием о твоём верном друге и теплоте, которую он приносит в жизнь.", slug=slugify("Лапка")))
addProducts(Product(name="Кулон «Полумесяц»", price=39000, concept="Духовность и вера", category="Кулон", descriptions="Кулон «Полумесяц» – Тонкий символ гармонии, женской энергии и мистики. Полумесяц несёт в себе тайну ночи, силу обновления и исполнения желаний. Он оберегает своего владельца и открывает путь к новым возможностям.", slug=slugify("Полумесяц")))
addProducts(Product(name="Кулон «Сердце на пульсе»", price=39000, concept="Любовь и романтика", category="Кулон", descriptions="Кулон «Сердце на пульсе» – Любовь – это ритм, который заставляет сердце биться чаще. Этот кулон символизирует настоящие чувства, искренние эмоции и связь, которая живёт в каждом ударе сердца.", slug=slugify("Сердце на пульсе")))
addProducts(Product(name="Кулон «Снежинка»", price=39500, concept="Природа", category="Кулон", descriptions="Кулон «Снежинка» – Уникальность в каждой детали. Как не бывает двух одинаковых снежинок, так и каждый человек – особенный. Этот кулон напомнит о твоей неповторимости и красоте момента.", slug=slugify("Снежинка")))
addProducts(Product(name="Кулон «Скрипичный ключ»", price=39500, concept="Музыка и искусство", category="Кулон", descriptions="Кулон «Скрипичный ключ» – Символ творчества, гармонии и внутренней мелодии жизни. Для тех, кто чувствует музыку в каждой секунде и знает, что самые важные ноты – это эмоции, звучащие в душе.", slug=slugify("Скрипичный ключ")))
addProducts(Product(name="Кулон «Якорь»", price=41000, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Якорь» – Символ устойчивости, надежды и верности своим принципам. Этот кулон станет оберегом для тех, кто ищет баланс в жизни и не боится встречать штормы, зная, что всегда найдёт тихую гавань.", slug=slugify("Якорь")))
addProducts(Product(name="Кулон «Олимпийские кольца»", price=42500, concept="Спорт", category="Кулон", descriptions="Кулон «Олимпийские кольца» – Пять переплетённых колец – знак единства, силы духа и стремления к вершинам. Этот кулон вдохновит на новые победы, напомнит о целеустремлённости и желании стать лучшей версией себя.", slug=slugify("Олимпийские кольца")))
addProducts(Product(name="Кулон «Рука Фатимы»", price=45500, concept="Духовность и вера", category="Кулон", descriptions="Кулон «Рука Фатимы» – Сильный амулет, защищающий от негатива и дурного глаза. Этот символ дарит удачу, оберегает своего владельца и наполняет жизнь гармонией и светлыми мыслями.", slug=slugify("Рука Фатимы")))
addProducts(Product(name="Кулон «Самолёт»", price=46500, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Самолёт» – Для мечтателей, путешественников и покорителей горизонтов. Этот кулон символизирует свободу, движение вперёд и желание открывать для себя новые миры.", slug=slugify("Самолёт")))
addProducts(Product(name="Кулон «Штурвал»", price=48000, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Штурвал» – Управляй своей судьбой, будь капитаном своей жизни. Этот кулон напоминает, что ты сам выбираешь свой путь, уверенно держишь руль и можешь пройти сквозь любые бури.", slug=slugify("Штурвал")))
addProducts(Product(name="Кулон «Планета»", price=48000, concept="Путешествия и приключения", category="Кулон", descriptions="Кулон «Планета» – Символ бесконечности, открытий и желания познать этот мир. Пусть этот кулон вдохновляет на смелые мечты и напоминает, что целая Вселенная ждёт тебя.", slug=slugify("Планета")))
addProducts(Product(name="Бегунок мини", price=28500, concept="Минимализм и универсальность", category="Бегунок", descriptions="Бегунок мини – Лаконичный элемент, который дополняет образ и создаёт ощущение лёгкости. Идеален для тех, кто ценит минимализм и элегантность в деталях.", slug=slugify("Бегунок мини")))
addProducts(Product(name="Бегунок", price=55000, concept="Минимализм и универсальность", category="Бегунок", descriptions="Бегунок – Стильный и универсальный аксессуар. Лаконичность, гармония и возможность сочетания с разными образами делают его отличным выбором для каждого дня.", slug=slugify("Бегунок")))
addProducts(Product(name="Колье-невидимка без кулона", price=28500, concept="Минимализм и универсальность", category="Колье", descriptions="Колье-невидимка – Элегантность в чистом виде. Лёгкое, почти невидимое украшение, которое подчёркивает естественную красоту и оставляет место для воображения.", slug=slugify("Колье-невидимка без кулона")))
addProducts(Product(name="Колье-неведимка с мини сердечком", price=45000, concept="Любовь и романтика", category="Колье", descriptions="Колье-невидимка с мини сердечком – Минималистичный акцент любви и нежности. Лёгкое украшение, которое будто парит на коже, создавая эффект воздушности и элегантности.", slug=slugify("к")))
addProducts(Product(name="Колье-неведимка с бегунком мини", price=44000, concept="Минимализм и универсальность", category="Колье", descriptions="Колье-невидимка с бегунком мини – Тонкое украшение для тех, кто любит утончённые детали. Лёгкость, изящность и плавность линий делают его идеальным дополнением любого образа.", slug=slugify("Колье-неведимка с бегунком мини")))
addProducts(Product(name="Колье-неведимка с бегунком", price=64000, concept="Минимализм и универсальность", category="Колье", descriptions="Колье-невидимка с бегунком – Невидимый штрих стиля. Этот аксессуар подчёркивает индивидуальность, создавая эффект невесомости и утончённости.", slug=slugify("Колье-неведимка с бегунком")))
addProducts(Product(name='Кулон Знак зодиака «Овен»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Овен» – Овен – символ энергии, смелости и решительности. Этот кулон идеально подойдёт тем, кто не боится брать на себя ответственность, идти к цели и зажигать своей страстью окружающих.", slug=slugify("Овен")))
addProducts(Product(name='Кулон Знак зодиака «Телец»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Телец» – Телец – знак стабильности, упорства и надёжности. Кулон станет символом внутренней силы и умения добиваться своего, напоминая о гармонии с собой и окружающим миром.", slug=slugify("Телец")))
addProducts(Product(name='Кулон Знак зодиака «Близнецы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Близнецы» – Близнецы – символ интеллекта, лёгкости и общительности. Этот кулон подчеркнёт любознательность, нестандартное мышление и стремление к новым знаниям и приключениям.", slug=slugify("Близнецы")))
addProducts(Product(name='Кулон Знак зодиака «Рак»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Рак» – Рак – знак глубины, чувствительности и привязанности. Кулон станет оберегом для тех, кто ценит уют, семью и искренние эмоции. Он напоминает о важности доверия и заботы.", slug=slugify("Рак")))
addProducts(Product(name='Кулон Знак зодиака «Лев»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Лев» – Лев – знак величия, уверенности и лидерства. Этот кулон подойдёт тем, кто привык быть в центре внимания, вдохновлять других и гореть своей идеей.", slug=slugify("Лев")))
addProducts(Product(name='Кулон Знак зодиака «Дева»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Дева» – Дева – символ разума, логики и перфекционизма. Этот кулон подчеркнёт практичность, внимательность к деталям и стремление к порядку во всём.", slug=slugify("Дева")))
addProducts(Product(name='Кулон Знак зодиака «Весы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Весы» – Весы – знак баланса, гармонии и красоты. Кулон подойдёт тем, кто ценит эстетику, умеет находить компромисс и стремится к равновесию во всех сферах жизни.", slug=slugify("Весы")))
addProducts(Product(name='Кулон Знак зодиака «Скорпион»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Скорпион» – Скорпион – символ страсти, силы и таинственности. Этот кулон подойдёт тем, кто обладает магнетизмом, знает себе цену и умеет добиваться желаемого.", slug=slugify("Скорпион")))
addProducts(Product(name='Кулон Знак зодиака «Стрелец»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Стрелец» – Стрелец – знак свободы, энергии и оптимизма. Этот кулон станет вдохновением для путешественников, мечтателей и всех, кто стремится к новым горизонтам.", slug=slugify("Стрелец")))
addProducts(Product(name='Кулон Знак зодиака «Козерог»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Козерог» – Козерог – символ целеустремлённости, дисциплины и силы духа. Этот кулон напоминает, что никакие препятствия не смогут остановить того, кто идёт к своей цели.", slug=slugify("Козерог")))
addProducts(Product(name='Кулон Знак зодиака «Водолей»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Водолей» – Водолей – знак оригинальности, независимости и новаторства. Этот кулон подчеркнёт уникальный взгляд на мир, креативность и стремление к свободе.", slug=slugify("Водолей")))
addProducts(Product(name='Кулон Знак зодиака «Рыбы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="Кулон Знак зодиака «Рыбы» – Рыбы – символ интуиции, творчества и глубины чувств. Этот кулон станет идеальным талисманом для мечтателей, романтиков и всех, кто живёт сердцем.", slug=slugify("Рыбы")))
addProducts(Product(name="Монеточка", price=173000, concept="Минимализм и универсальность", category="Монеточка", descriptions="Монеточка – Маленькая, но значимая деталь, символ удачи и защиты. Идеальный аксессуар для тех, кто ценит минимализм с глубоким смыслом.", slug=slugify("Монеточка")))
addProducts(Product(name="Гравировка монетки 0.7г", price=47000, concept="Минимализм и универсальность", category="Монеточка", descriptions="Гравировка монетки 0.7г – Персонализируй своё украшение! Тонкая гравировка на монетке весом 0.7 г делает её уникальной – твой особый знак или важные слова всегда будут рядом.", slug=slugify("Гравировка монетки 0.7г")))
addProducts(Product(name="Гравировка монетки 1.1г", price=68000, concept="Минимализм и универсальность", category="Монеточка", descriptions="Гравировка монетки 1.1г – Уникальный штрих в твоём стиле. Гравировка на монетке весом 1.1 г подчеркнёт твою индивидуальность, сделав украшение особенным и личным.", slug=slugify("Гравировка монетки 1.1г")))
addProducts(Product(name="Кулон из серебра", price=10000, concept="Минимализм и универсальность", category="Кулон", descriptions="Кулон из серебра – Лаконичный и элегантный кулон, который станет отражением твоего характера и стиля. Чистота серебра подчеркнёт изящество и добавит образу утончённости.", slug=slugify("Кулон из серебра")))
addProducts(Product(name="Гравировка в серебре", price=15000, concept="Минимализм и универсальность", category="Монеточка", descriptions="Гравировка в серебре – Персонализируй своё украшение! Гравировка на серебряной поверхности придаст ему уникальность и сделает символом чего-то важного лично для тебя.", slug=slugify("Гравировка в серебре")))
#

#Запуск
if __name__ == "__main__":
    with app.app_context():
        db.create_all() # Создаем бд
        add_admin() # Создаем акк админа
    app.run(debug=False, port=5000) # Запуск