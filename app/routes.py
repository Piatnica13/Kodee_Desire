from flask import Blueprint, current_app,  render_template, request, redirect, session, flash, jsonify, send_from_directory, current_app, url_for
from functools import wraps
from app.models import db, Product
from app.forms import LoginForm, RegisterForm, ProfilMainPassForm, ProfilSplitForm, ProfilAddSplit, ProfilAddressForm
from app.services.user import UserService
from app.services.product import ProductService
from app.services.application import AppService
import os

bp = Blueprint("main", __name__)

# ИДЕНТИФИКАЦИЯ USER
def login_required(f):
    @wraps(f)
    def decorater(*args, **kwargs):
        user = UserService.get_user(session.get("user_id"))
        if not user:
            return redirect("/login")
        return f(user=user, *args, **kwargs)
    return decorater

# ПРОВЕРКА НА АДМИН ДОСТУП
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin'):
            current_app.logger.warning("Попытка доступа к админке без прав.")
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function


# Главный маршрут
@bp.route('/')
def index():
    products = Product.query.all()
    admin = session.get('admin')
    if admin:
        return render_template('index.html', admin=True, products=products)
    return render_template('index.html', admin=False, products=products)
    

# ПРОФИЛЬ
@bp.route('/profil', methods=["GET"])
@login_required
def profil(user):
    formSplit = ProfilSplitForm()
    formPass = ProfilMainPassForm()
    formAdd = ProfilAddSplit()
    formAddress = ProfilAddressForm()

    favorite_products = Product.query.filter(Product.id.in_(user.favourites)).all() 

    return render_template("profil.html", user=user, favorite_products=favorite_products, formSplit=formSplit, formPass=formPass, formAdd=formAdd, formAddress=formAddress)

@bp.route('/profil/update_password', methods=["POST"])
@login_required
def update_password(user):
    data = request.form
    
    UserService.update_password(user, data)

    db.session.commit()
        
    return redirect("/profil")


@bp.route('/profil/update_user', methods=["POST"])
@login_required
def update_user(user):
    data = request.form
    
    UserService.update_user(user, data)

    db.session.commit()
    
    return redirect("/profil")

@bp.route('/profil/change_address', methods=["POST"])
@login_required
def change_address(user):
    data = request.form
    
    UserService.change_address(user, data)

    db.session.commit()
    
    flash("Адреса успешно обновлены.")
    
    return redirect("/profil")

@bp.route('/profil/add_address', methods=["POST"])
@login_required
def profil_add_address(user):
    form = ProfilAddSplit()
    
    if not form.validate_on_submit():
        flash("Обязательные поля не были заполнены. Повторите попытку.")
        return redirect("/profil")
    
    data = request.form
    
    UserService.add_address(user, data)
    UserService.put_address(user, data)
    
    db.session.commit()
    
    flash("Адрес успешно добавлен.")
    
    return redirect("/profil")

# КОРЗИНА
# Маршрут для корзины
@bp.route('/basket', methods=["GET", "POST"])
@login_required
def basket(user):
    form = ProfilAddSplit()
    basket = ProductService.get_user_basket(user)
    
    return render_template('basket.html', basket=basket, user=user, form=form)

# Добавление товара в корзину
@bp.route('/add_basket', methods=['POST'])
def add_basket():
    data = request.get_json()
    result = ProductService.add_product_to_basket(data)
    
    return jsonify(result)
            
# Удаление товара из корзины
@bp.route('/delete_basket', methods=['POST'])
@login_required
def delete_basket(user):
    data = request.get_json()
    result = ProductService.delete_product_from_basket(user, data)
            
    return jsonify(result)

# ДОБАВЛЕНИЕ АДРЕСА
@bp.route('/add_address', methods=["POST"])
@login_required
def addAddress(user):
    data = request.get_json()
    result = UserService.add_address(user, data)

    return jsonify(result)
            

# ДОБАВЛЕНИЕ ИЛИ УДАЛЕНИЕ ИЗБРАННОГО
@bp.route('/add_favorite', methods=['POST'])
def add_favorite():
    data = request.get_json()
    
    result = ProductService.add_or_delete_favorite_product(data)
    
    return jsonify(result)
            

# ПЕРЕДАЧА ВСЕХ ТОВАРОВ В JS
@bp.route("/AllProductJS")
def AllProductJS():
    result = ProductService.trans_products_to_JS()
    return jsonify(result)


# ПОИСК
@bp.route("/search")
def search():
    data = request.args
    result = ProductService.search_product(data)
    return jsonify(result)


# МАГАЗИН
@bp.route('/shop')
def shop():
    result = ProductService.get_products_for_properties()
    return render_template("shop.html", products_json=result)


# КОНТАКТЫ
@bp.route('/contact')
def contact():
    current_app.logger.debug("Открыта страница контактов.")
    return render_template('contact.html')


# СПРАВКА
@bp.route('/help/<theme>')
def help(theme):
    current_app.logger.debug("Открыта страница справки.")
    return render_template('help.html', theme=theme)


# ИНДИВИДУАЛЬНЫЙ ЗАКАЗ
@bp.route('/individual')
def individual_order():
    current_app.logger.debug("Открыта страница индивидуального заказа.")
    return render_template('individual.html')


# РЕГИСТРАЦИЯ
@bp.route('/register')
def register():
    form = RegisterForm()    
    current_app.logger.debug("Открыта страница регистрации.")
    return render_template('register.html', form=form)
    
@bp.route("/register/add_user", methods=['POST'])
def reg_user():
    result = UserService.add_user()
    
    if result["success"] == False:
        flash(result["message"])
        return redirect("/register")
    
    flash(result["message"])
    return redirect("/")


# ВХОД В АККАУНТ
@bp.route('/login')
def login():
    form = LoginForm()
    current_app.logger.debug("Открыта страница входа.")
    return render_template('login.html', form=form)

@bp.route('/login/log_user', methods=['POST'])
def log_user():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    result = UserService.log_user(admin_email, admin_password)
    if result['success'] == False:
        flash(result["message"])
        return redirect('/login')
    
    if result['admin']:
        flash(result["message"])
        return redirect('/admin')
        
    flash(result["message"])
    return redirect('/')


# ВХОД С ПОМОЩЬЮ GOOGLE
@bp.route('/login/google')
def google_login():
    from main import oauth
    
    redirect_url = url_for('main.authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_url)


# ВХОД С ПОМОЩЬЮ GOOGLE 
@bp.route('/callback')
def authorize():
    result = UserService.log_user_from_google()
    
    if result['success'] == False:
        flash(result['message'])
        return redirect('/login')
    
    flash(result['message'])
    return redirect('/')    
    

# ВЫХОД ИЗ АККАУНТА
@bp.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('admin', None)

    flash("Вы успешно вышли из аккаунта!")
    
    current_app.logger.info(f"Пользователь вышел из аккаунта.")
    return redirect('/')
#

@bp.route('/admin/panel')
@admin_required
def admin_panel():
    return render_template('admin.html')

# Добавление изображений в созданную папку, админ
@bp.route('/admin/add_imgs', methods=['POST'])
@admin_required
def add_imgs():
    data_files = request.files
    data_form = request.form
    result = ProductService.add_imgs_for_product(data_files, data_form)

    return jsonify(result)
    
# СТРАНИЦА ПРОДУКТА
@bp.route('/product/<slug>')
def product(slug):
    result = ProductService.check_user_for_product_page(slug)
    
    return render_template('product.html', product=result['product'], user=result['user'], address=result['address'], favarite=result['favorite'])


# ВЫВОД ПРОДУКТОВ
@bp.route('/api/products')
def get_product():
    result = ProductService.get_product()
    return jsonify(result)


# ВСЕ СЕРВЕРНЫЕ МОМЕНТЫ
@bp.after_request
def apply_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

@bp.route('/.well-known/security.txt')
def security_txt():
    return send_from_directory(current_app.static_folder + "/.well-known", 'security.txt')

@bp.route('/robots.txt')
def robots():
    return send_from_directory(current_app.static_folder, 'robots.txt')

@bp.route('/sitemap.xml')
def sitemap():
    return send_from_directory(current_app.static_folder, 'sitemap.xml')

# ОБРАБОТКА ОШИБОК
@bp.app_errorhandler(Exception)
def errors(error):
    result = AppService.show_error(error)
    return render_template("error.html", code=result['code'], title=result['title'])