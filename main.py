from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session, flash, url_for, jsonify
from models import db, Address, Person, Product, Product_image
from slugify import slugify
import json


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
    user = Person.query.get(int(user_id)) 
    favorite_products = Product.query.filter(Product.id.in_(user.favourites)).all()
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
                    return render_template("profil.html", user=user, errors=errors, favorite_products = favorite_products)
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
                return render_template("profil.html", errors=errors, user=user, favorite_products = favorite_products)
            except:
                db.session.rollback()
                return "Ошибка обновления данных"
        else:
            return "Пользователь не найден"
    else:

        if not user:  # Если в БД нет пользователя
            session.pop('user_id', None)  # Очистка невалидной сессии
            return redirect('/login')

        return render_template("profil.html", user=user, errors=errors, favorite_products = favorite_products)

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Удаляем ID пользователя из сессии
    return redirect('/')

@app.route('/product/<slug>')
def product(slug):
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')
    product = Product.query.filter_by(slug=slug).first()
    person = Person.query.get(int(user_id))
    address = Address.query.filter_by(person_id = person.id).first()
    
    
    
    if not product:
        return "Товар не найден", 404
    
    return render_template('product.html', product=product, user=person, address=address, favarite=person.favourites)


@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    data = request.get_json()  
    print("Полученные данные:", data)  # Для отладки

    product_id = data.get("product_id")
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({"success": False, "error": "Пользователь не авторизован"})

    user = Person.query.get(int(user_id))

    if not user:
        return jsonify({"success": False, "error": "Пользователь не найден"})

    if product_id in user.favourites:
        new_favorites = [pid for pid in user.favourites if pid != product_id]
        print("Удаляю из избранного")
    else:
        new_favorites = user.favourites + [product_id]  
        print("Добавляю в избранное")

    user.favourites = new_favorites  # Полностью заменяем список

    print("Перед коммитом:", user.favourites)
    db.session.add(user)  # Добавляем объект обратно в сессию
    db.session.commit()  # Сохраняем изменения

    print("После коммита:", Person.query.get(user.id).favourites)
    
    return jsonify({"success": True, "favorites": user.favourites})


@app.route("/search")
def search():
    query = request.args.get("query", "").strip()
    
    if not query:
        return jsonify([])  # Если пустой запрос, возвращаем пустой список

    # Убираем ilike для id
    products = Product.query.filter(
        (Product.id.ilike(f"%{query}%")) |
        (Product.name.ilike(f"%{query.capitalize()}%"))
    ).limit(10).all()
    
    results = [{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "slug": p.slug,
        "image": p.image()
    } for p in products]

    return jsonify(results)

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
            imagePak1 = Product_image(1 ,product.id, f"/static/image/productImgs/{ product.slug }/img1.jpg")
            imagePak2 = Product_image(2 ,product.id, f"/static/image/productImgs/{ product.slug }/img2.jpg")
            imagePak3 = Product_image(3 ,product.id, f"/static/image/productImgs/{ product.slug }/img3.jpg")
            imagePak4 = Product_image(4 ,product.id, f"/static/image/productImgs/{ product.slug }/img4.jpg")
            db.session.add(imagePak1)
            db.session.add(imagePak2)
            db.session.add(imagePak3)
            db.session.add(imagePak4)
            db.session.commit()
        
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
addProducts(Product(name="Колье-неведимка с мини сердечком", price=45000, concept="Любовь и романтика", category="Колье", descriptions="Колье-невидимка с мини сердечком – Минималистичный акцент любви и нежности. Лёгкое украшение, которое будто парит на коже, создавая эффект воздушности и элегантности.", slug=slugify("Колье-неведимка с мини сердечком")))
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    with app.app_context():
        db.create_all()