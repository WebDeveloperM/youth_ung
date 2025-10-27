from django.contrib import admin
import organisation.translation
from organisation.models import Organisation, Department, Section, New, CategoryNew

admin.site.register(Department)
admin.site.register(Organisation)
admin.site.register(Section)

@admin.register(CategoryNew)
class CategoryNewAdmin(admin.ModelAdmin):
    list_display = ('title',)
    fields = ('title',)

@admin.register(New)
class NewAdmin(admin.ModelAdmin):
    list_display = ('title',)
    fields = ('category','title','mainImage','description_1','description_2','img_1',
            'description_3','img_2','description_4','img_3','description_5','img_4','img_5',
            'date','view','is_active',)

