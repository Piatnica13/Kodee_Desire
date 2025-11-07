from flask_admin import Admin
from app.models import Person, Product, Product_image
from app.models import db
from app.views import PersonAdmin, ProductAdmin, ImagesAdmin,MyAdminPanel

admin = Admin(
    name="Kodee Desire Panel",
    index_view=MyAdminPanel()
    )

admin.add_view(PersonAdmin(Person, db.session))
admin.add_view(ProductAdmin(Product, db.session))
admin.add_view(ImagesAdmin(Product_image, db.session))