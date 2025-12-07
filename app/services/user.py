from app.models import Person, Address
from flask import session, current_app, request, flash
from werkzeug.security import generate_password_hash

class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        user = Person.query.get(user_id)
        if not user:
            current_app.logger.error("Пользователь не найден по id")
            return False
        return user
    
    @staticmethod
    def update_user(user: Person):
        name = request.form.get("name")
        last_name = request.form.get("last_name")
        phone = request.form.get("phone")
        email = request.form.get("email")
        address = request.form.get("address")
        
        user.name = name.strip() if name else user.name
        user.last_name = last_name.strip() if last_name else user.last_name
        user.phone = phone.strip() if phone else user.phone
        user.email = email.strip() if email else user.email
        user.address = address.strip() if address else user.address
        
        current_app.logger.debug(f"Обновлена инофрмация для пользователя ID {user.id}")
    
    @staticmethod
    def update_password(user: Person, errors):
        new_pass = request.form.get("newPass")
        re_new_pass = request.form.get("reNewPass")

        if new_pass and new_pass == re_new_pass and len(new_pass) >= 6:
            heshed_pass = generate_password_hash(new_pass)
            user.password = heshed_pass
            current_app.logger.debug(f"Пароль пользователя ID {user.id} успешно обновлён.")
        else:
            errors['comparisons'] = "Ошибка, пароли не совпадают или пароль меньше 6 символов"
            flash("пароли не свопадают или пароль состоит менее чем из 6 символов", "error")
            current_app.logger.warning(f"Ошибка при смене пароля у пользователя ID {user.id}: несовпадение или короткий пароль.")
    
    @staticmethod
    def change_address(user: Person):
        deleted_addresses = request.form.get("deleted_addresses")
        deleted_ids = [int(id) for id in deleted_addresses.split(",") if id.isdigit()]

        if deleted_ids:
            Address.query.filter(Address.id.in_(deleted_ids), Address.person_id == user.id).delete(synchronize_session=False)
            current_app.logger.info(f"Пользователь ID {user.id} удалил адреса: {deleted_ids}")
        else:
            current_app.logger.debug(f"Нет адресов для удаления у пользователя ID {user.id}.")

        addressFromForm = request.form.get("addresses")

        if addressFromForm is not None:
            user.address = addressFromForm
            current_app.logger.debug(f"Пользователь ID {user.id} установил основной адрес: {addressFromForm}")
        else:
            user.address = ""
            current_app.logger.debug(f"Пользователь ID {user.id} очистил основной адрес.")

