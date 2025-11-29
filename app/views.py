from flask_admin.contrib.sqla import ModelView
from flask import redirect, session, url_for
from flask_admin import AdminIndexView
from app.models import Product, Product_image, db
from slugify import slugify



class MyAdminPanel(AdminIndexView):
    def is_accessible(self):
        return session.get('admin')
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('index'))


class SecurityAdmin(ModelView):
    def is_accessible(self):
        return session.get('admin') is True
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('index'))


class  PersonAdmin(SecurityAdmin):
    column_list = ['id', 'name', 'phone', 'email', 'address', 'favourites', 'basket']
    column_searchable_list = ['name', 'phone', 'email']
    can_delete = True
    can_edit = True


class ProductAdmin(SecurityAdmin):
    column_list = ['id', 'name', 'price', 'weight', 'concept', 'category', 'descriptions', 'slug', 'images']
    column_searchable_list = ['name']
    can_delete = True
    can_edit = True
    can_create = True
    
    def on_model_change(self, form, model, is_created):
        if is_created:
            model.slug = slugify(model.name)
    
    def after_model_change(self, form, model, is_created):
        if not is_created:
            return
        
        db.session.flush()
        
        imgs = [
            Product_image(1, model.id, f"/static/image/productImgs/{model.slug}/img1.webp"),
            Product_image(2, model.id, f"/static/image/productImgs/{model.slug}/img2.webp"),
            Product_image(3, model.id, f"/static/image/productImgs/{model.slug}/img3.webp"),
            Product_image(4, model.id, f"/static/image/productImgs/{model.slug}/img4.webp"),
        ]
        
        try:
            db.session.add_all(imgs)
            db.session.commit()

        except Exception as e:
            print("fail")


class ImagesAdmin(SecurityAdmin):
    column_list = ['id', 'num', 'product_id', 'img1']
    column_searchable_list = ['id', 'product_id']
    can_delete = True
    can_edit = True
    can_create = True
    