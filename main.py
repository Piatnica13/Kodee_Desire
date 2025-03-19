from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session, flash, url_for
from models import db, Address, Person, Product, Product_image
from slugify import slugify


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Проверь, что база данных настроена
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.secret_key = 'SecretKey'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profil', methods=["POST", "GET"])
def profil():
    user_id = session.get('user_id')  # Проверяем, есть ли user_id в сессии
    if not user_id:
        return redirect('/login')
    errors={}
    #проверям работать нам с бд или отобразить страницу
    user = Person.query.get(int(user_id))  # Приводим user_id к int
    if request.method == "POST":
        #авторизован ли пользователь
        if user:
            #обновления информации в базе данных
            if "update_info" in request.form:
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
            #обновления пароля
            elif "update_password" in request.form:
                new_pass = request.form.get("newPass")
                re_new_pass = request.form.get("reNewPass")

                if new_pass and new_pass == re_new_pass and len(new_pass) >= 6:
                    heshed_pass = generate_password_hash(request.form.get("newPass"))
                    user.password = heshed_pass
                else:
                    errors['comparisons'] = "Ошибка, пароли не совпадают или пароль меньше 6 символов"
                    flash("пароли не свопадают или пароль состоит менее чем из 6 символов", "error")
                    return render_template("profil.html", user=user, errors=errors)
            #добавления адресов
            elif "add_address" in request.form:
                name = request.form.get("name")
                city = request.form.get("city")
                street = request.form.get("street")
                home = request.form.get("home")
                flat = request.form.get("flat")
                person_id = session["user_id"]

                new_address = Address(name=name, city=city, street=street, home=home, flat=flat, person_id=person_id)
                db.session.add(new_address)
                db.session.commit()
            #выбор или удаления адресов
            elif "work_with_address" in request.form:
                deleted_addresses = request.form.get("deleted_addresses")

                if deleted_addresses:
                    deleted_ids = [int(id) for id in deleted_addresses.split(",") if id.isdigit()]

                    # Удаляем только те адреса, которые принадлежат текущему пользователю
                    Address.query.filter(Address.id.in_(deleted_ids), Address.person_id == user.id).delete(synchronize_session=False)
                    
                addressFromForm = request.form.get("addresses")
                if addressFromForm != None:
                    user.address = addressFromForm
                else:
                    user.address = ""
            #пробуем занести информацю в бд и выводим страницу профиля
            try:
                db.session.commit()
                return render_template("profil.html", errors=errors, user=user)
            except:
                db.session.rollback()
                return "Ошибка обновления данных"
        else:
            return "Пользователь не найден"
    else:

        if not user:  # Если в БД нет пользователя
            session.pop('user_id', None)  # Очистка невалидной сессии
            return redirect('/login')

        return render_template("profil.html", user=user, errors=errors)

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Удаляем ID пользователя из сессии
    return redirect('/')

@app.route('/product/<slug>')
def product(slug):
    product = Product.query.filter_by(slug=slug).first()
    
    if not product:
        return "Товар не найден", 404
    
    return render_template('product.html', product=product)


@app.route('/shop')
def shop():
    return render_template('shop.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/basainfo')
def basainfo():
    person = Person.query.order_by(Person.id).all()
    address = Address.query.order_by(Address.id).all()
    return render_template('basainfo.html', data=person, add=address)


@app.route('/register', methods=['POST', 'GET'])
def register():
    errors = {}
    if request.method == "POST":
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        #проверка на ошибки
        if len(password) < 6:
            errors['len'] = "Пароль меньше 6 символов"
            return render_template('register.html', errors=errors)
        hashed_password = generate_password_hash(password)  # Хэшируем пароль
        
        person = Person(name=name, email=email, password=hashed_password)
        try:
            db.session.add(person)
            db.session.commit()
            user = Person.query.filter_by(email=email).first()
            if user and check_password_hash(user.password, password):  # Сравниваем хэш
                session['user_id'] = user.id
            return redirect('/')
        except:
            return "Ошибка занесения в Базу данных"
    else:
        return render_template('register.html', errors=errors)

@app.route('/login', methods=['POST', 'GET'])
def login():
    errors = {}
    #работать с бд или отрисовать страницу
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = Person.query.filter_by(email=email).first()
        
        #проверка на ошибки вводе данных
        if not email or not password:
            errors["error"] = "Ошибка, обязательные поля пустые"
        if len(password) < 6:
            errors["len"] = "Ошибка, длина пароля меньше 6 символов"
        
        # Проверяем данные в базе:
        if user and check_password_hash(user.password, password):  # Сравниваем хэш
            session['user_id'] = user.id
            return redirect(url_for('profil')) # Перенаправляем на защищенную страницу
        else:
            errors["comparisons"] = "Ошибка ввода, не правильно введен пароль или email"
            return render_template("login.html", errors=errors)
    return render_template('login.html', errors=errors)


def addProducts(product):
    with app.app_context():
        # проверка есть ли продукт в бд
        chekProduct = Product.query.filter_by(name=product.name).first()
        if chekProduct:
            return
        else:
            db.session.add(product)
            db.session.commit()
            imagePak = Product_image(product.id, "", "", "", "", "")
            db.session.add(imagePak)
            db.session.commit()
        
addProducts(Product(name="Кулон «Бес&shy;конеч&shy;ность»", price=28500, concept="", category="Кулон", descriptions="", slug=slugify("Бесконечность")))
addProducts(Product(name="Кулон «Голубь»", price=30500, concept="", category="Кулон", descriptions="", slug=slugify("Голубь")))
addProducts(Product(name="Кулон «Бес&shy;конеч&shy;ность love»", price=31500, concept="", category="Кулон", descriptions="", slug=slugify("Бесконечность love")))
addProducts(Product(name="Кулон «Бриллиант»", price=33000, concept="", category="Кулон", descriptions="", slug=slugify("Бриллиант")))
addProducts(Product(name="Кулон «Пульс»", price=33000, concept="", category="Кулон", descriptions="", slug=slugify("Пульс")))
addProducts(Product(name="Кулон «Пацифик»", price=33000, concept="", category="Кулон", descriptions="", slug=slugify("Пацифик")))
addProducts(Product(name="Кулон «Клевер»", price=33000, concept="", category="Кулон", descriptions="", slug=slugify("Клевер")))
addProducts(Product(name="Кулон «Горы»", price=33500, concept="", category="Кулон", descriptions="", slug=slugify("Горы")))
addProducts(Product(name="Кулон «Дерево»", price=33500, concept="", category="Кулон", descriptions="", slug=slugify("Дерево")))
addProducts(Product(name="Кулон «Крестик»", price=34000, concept="", category="Кулон", descriptions="", slug=slugify("Крестик")))
addProducts(Product(name="Кулон «Звезда Давида»", price=34000, concept="", category="Кулон", descriptions="", slug=slugify("Звезда Давида")))
addProducts(Product(name="Кулон «Корона»", price=34500, concept="", category="Кулон", descriptions="", slug=slugify("Корона")))
addProducts(Product(name="Кулон «Сердце контур»", price=35000, concept="", category="Кулон", descriptions="", slug=slugify("Сердце контур")))
addProducts(Product(name="Кулон «Сердце пульс»", price=35500, concept="", category="Кулон", descriptions="", slug=slugify("Сердце пульс")))
addProducts(Product(name="Кулон «Мальчик»", price=36000, concept="", category="Кулон", descriptions="", slug=slugify("Мальчик")))
addProducts(Product(name="Кулон «Девочка»", price=36000, concept="", category="Кулон", descriptions="", slug=slugify("Девочка")))
addProducts(Product(name="Кулон «Солнце»", price=36000, concept="", category="Кулон", descriptions="", slug=slugify("Солнце")))
addProducts(Product(name="Кулон «Крыло»", price=37000, concept="", category="Кулон", descriptions="", slug=slugify("Крыло")))
addProducts(Product(name="Кулон «Роза ветров»", price=37500, concept="", category="Кулон", descriptions="", slug=slugify("Роза ветров")))
addProducts(Product(name="Кулон «Ангел»", price=37500, concept="", category="Кулон", descriptions="", slug=slugify("Ангел")))
addProducts(Product(name="Кулон «Ракетка»", price=37500, concept="", category="Кулон", descriptions="", slug=slugify("Ракетка")))
addProducts(Product(name="Кулон «Лапка»", price=38000, concept="", category="Кулон", descriptions="", slug=slugify("Лапка")))
addProducts(Product(name="Кулон «Полумесяц»", price=39000, concept="", category="Кулон", descriptions="", slug=slugify("Полумесяц")))
addProducts(Product(name="Кулон «Сердце на пульсе»", price=39000, concept="", category="Кулон", descriptions="", slug=slugify("Сердце на пульсе")))
addProducts(Product(name="Кулон «Снежинка»", price=39500, concept="", category="Кулон", descriptions="", slug=slugify("Снежинка")))
addProducts(Product(name="Кулон «Скрипичный ключ»", price=39500, concept="", category="Кулон", descriptions="", slug=slugify("Скрипичный ключ")))
addProducts(Product(name="Кулон «Якорь»", price=41000, concept="", category="Кулон", descriptions="", slug=slugify("Якорь")))
addProducts(Product(name="Кулон «Олимпийские кольца»", price=42500, concept="", category="Кулон", descriptions="", slug=slugify("Олимпийские кольца")))
addProducts(Product(name="Кулон «Рука Фатимы»", price=45500, concept="", category="Кулон", descriptions="", slug=slugify("Рука Фатимы")))
addProducts(Product(name="Кулон «Самолёт»", price=46500, concept="", category="Кулон", descriptions="", slug=slugify("Самолёт")))
addProducts(Product(name="Кулон «Штурвал»", price=48000, concept="", category="Кулон", descriptions="", slug=slugify("Штурвал")))
addProducts(Product(name="Кулон «Планета»", price=48000, concept="", category="Кулон", descriptions="", slug=slugify("Планета")))
addProducts(Product(name="Бегунок мини", price=28500, concept="", category="Бегунок", descriptions="", slug=slugify("Бегунок мини")))
addProducts(Product(name="Бегунок", price=55000, concept="", category="Бегунок", descriptions="", slug=slugify("Бегунок")))
addProducts(Product(name="Колье-невидимка без кулона", price=28500, concept="", category="Колье", descriptions="", slug=slugify("Колье-невидимка без кулона")))
addProducts(Product(name="Колье-неведимка с мини сердечком", price=45000, concept="", category="Колье", descriptions="", slug=slugify("Колье-неведимка с мини сердечком")))
addProducts(Product(name="Колье-неведимка с бегунком мини", price=44000, concept="", category="Колье", descriptions="", slug=slugify("Колье-неведимка с бегунком мини")))
addProducts(Product(name="Колье-неведимка с бегунком", price=64000, concept="", category="Колье", descriptions="", slug=slugify("Колье-неведимка с бегунком")))
addProducts(Product(name='Кулон Знак зодиака «Овен»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Овен")))
addProducts(Product(name='Кулон Знак зодиака «Телец»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Телец")))
addProducts(Product(name='Кулон Знак зодиака «Близнецы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Близнецы")))
addProducts(Product(name='Кулон Знак зодиака «Рак»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Рак")))
addProducts(Product(name='Кулон Знак зодиака «Лев»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Лев")))
addProducts(Product(name='Кулон Знак зодиака «Дева»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Дева")))
addProducts(Product(name='Кулон Знак зодиака «Весы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Весы")))
addProducts(Product(name='Кулон Знак зодиака «Скорпион»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Скорпион")))
addProducts(Product(name='Кулон Знак зодиака «Стрелец»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Стрелец")))
addProducts(Product(name='Кулон Знак зодиака «Козерог»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Козерог")))
addProducts(Product(name='Кулон Знак зодиака «Водолей»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Водолей")))
addProducts(Product(name='Кулон Знак зодиака «Рыбы»', price=36000, concept="Знаки зодиака", category="Кулон", descriptions="", slug=slugify("Рыбы")))
addProducts(Product(name="Монеточка", price=173000, concept="", category="Монеточка", descriptions="", slug=slugify("Монеточка")))
addProducts(Product(name="Гравировка монетки 0.7г", price=47000, concept="", category="Монеточка", descriptions="", slug=slugify("Гравировка монетки 0.7г")))
addProducts(Product(name="Гравировка монетки 1.1г", price=68000, concept="", category="Монеточка", descriptions="", slug=slugify("Гравировка монетки 1.1г")))
addProducts(Product(name="Кулон из серебра", price=10000, concept="", category="Кулон", descriptions="", slug=slugify("Кулон из серебра")))
addProducts(Product(name="Гравировка в серебре", price=15000, concept="", category="Монеточка", descriptions="", slug=slugify("Гравировка в серебре")))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    with app.app_context():
        db.create_all()