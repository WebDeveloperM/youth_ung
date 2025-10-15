from django.contrib import admin

from organisation.models import Organisation, Department, Section

# Register your models here.

admin.site.register(Organisation)
admin.site.register(Department)
admin.site.register(Section)