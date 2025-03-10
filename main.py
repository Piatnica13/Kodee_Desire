from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.secret_key = 'SecretKey'

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(40), nullable=True, default="")
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(11), nullable=True, default="")
    email = db.Column(db.String(75), nullable=False)
    address = db.Column(db.String(50), nullable=True, default="")

    def __repr__(self):
        return f"{self.name}"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/profil', methods=["POST", "GET"])
def profil():
    if request.method == "POST":
        user = Person.query.get(session["user_id"])
        if user:
            user.name = request.form.get("name")
            user.last_name = request.form.get("last_name", "")
            user.phone = request.form.get("phone", "")
            user.email = request.form.get("email")
            user.address = request.form.get("address", "")

            try:
                db.session.commit()
                return redirect("/profil")
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

        return render_template("profil.html", user=user)

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
    return render_template('basainfo.html', data=person)


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == "POST":
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        
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
        return render_template('register.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        # Проверяем данные в базе:
        user = Person.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):  # Сравниваем хэш
            session['user_id'] = user.id
            return redirect('/profil') # Перенаправляем на защищенную страницу
        else:
            return 'Неправильный email или пароль'
    return render_template('login.html')


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    with app.app_context():
        db.create_all()