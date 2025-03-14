from werkzeug.security import generate_password_hash, check_password_hash

from flask import Flask, render_template, request, redirect, session, flash, url_for
from models import db, Address, Person

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
    user = Person.query.get(session['user_id']) 
    errors={}
    #проверям работать нам с бд или отобразить страницу
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
                    print(34)
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
        user_id = session.get('user_id')  # Проверяем, есть ли user_id в сессии
        if not user_id:
            return redirect('/login')

        user = Person.query.get(int(user_id))  # Приводим user_id к int

        if not user:  # Если в БД нет пользователя
            session.pop('user_id', None)  # Очистка невалидной сессии
            return redirect('/login')

        return render_template("profil.html", user=user, errors=errors)

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Удаляем ID пользователя из сессии
    return redirect('/')


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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    with app.app_context():
        db.create_all()