from flask import Flask, render_template


app = Flask(__name__)


@app.route('/')
def index():
    print(34)
    return render_template('/templates/index.html')

@app.route('/shop')
def shop():
    return render_template('/shop.html')


@app.route('/contact')
def contact(): 
    return render_template('contact.html')


@app.route('/register')
def register(): 
    return render_template('register.html')


@app.route('/login')
def login(): 
    return render_template('login.html')



if __name__ == "__main__":
    app.run(debug=True)