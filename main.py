from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://Piatnica13:1q2w3ee3w2q1@pythonanywhere.com/Piatnica13$testdatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    password = db.Column(db.String(25), nullable=False)
    email = db.Column(db.String(75), nullable=False)
    
    def __repr__(self):
        return f"{self.name}"

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/test-db')
def test_db():
    try:
        db.session.execute('SELECT 1')
        return "Подключение к базе данных успешно!"
    except Exception as e:
        return f"Ошибка подключения: {e}"


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
        person = Person(name=name, email=email, password=password)
        try:
            db.session.add(person)
            db.session.commit()
            return redirect('/')
        except:
            return print('Ошибка')
    else:
        return render_template('register.html')


@app.route('/login')
def login(): 
    return render_template('login.html')


if __name__ == "__main__":
    app.run(debug=True)