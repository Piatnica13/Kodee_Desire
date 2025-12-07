from flask import Flask
from dotenv import load_dotenv
from app.models import db
from app.config import DevelopmentConfig, ProductionConfig
from app.log import setup_logging
from app.admin import admin
from flask_wtf import CSRFProtect
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import os

def create_app():
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    
    # Логи (log.py)
    setup_logging(app)
    app.logger.info("Логирование настроено.")


    # Подключение .env файла
    load_dotenv('.password.env')
    app.logger.info("Файл .env загружен.")
    
    
    # Выбираем конфигурацию по окружению
    env = os.getenv("FLASK_ENV", "development")
    if env == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)


    # Подключение базы данных
    pyPassword = os.getenv("POSTGRESSQL")
    if pyPassword != None:
        app.config['SQLALCHEMY_DATABASE_URI'] = pyPassword
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'     
        
    # Инициализация соединения
    db.init_app(app) 
    app.logger.info("База данных инициализирована.")
    
    
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True
    }

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.logger.info("Настройки базы данных заданы (POSTGRES).")

    # Создание ключа
    app.secret_key = os.getenv("SECRET_KEY")
    app.logger.info(f"Секретный ключ загружен из .env.")

    # Инициализация админ панели
    admin.init_app(app)
    app.logger.info("Админ панель инициализирована.")

    

    # Cookie Безопасность
    app.config.update(
        SESSION_COOKIE_SECURE=True,      # Только через HTTPS
        SESSION_COOKIE_HTTPONLY=True,    # JS не получит доступ к cookie
        SESSION_COOKIE_SAMESITE='Lax'    # Защита от CSRF
    )
    app.logger.info("Cookie настроено")


    # CSRF Безопасность
    CSRFProtect(app)
    app.logger.info("CSRF настроено")

    
    # IOS Безопасность
    CORS(app, supports_credentials=True, origins=["https://kodee.kz"])
    
    from app.routes import bp
    # Регистрация блюпринтов
    app.register_blueprint(bp)
    
    return app

def create_oauth(app):
    # OAuth google
    oauth = OAuth(app)
    app.logger.info("OAuth создано")

    # Настройка OAuth google
    oauth.register(
        name='google',
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )
    return oauth