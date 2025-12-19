from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html

from organisation.models import Organisation, Department, Section


@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    """Админка для организаций"""
    list_display = ('name', 'email', 'phone', 'employees_count', 'created_at')
    list_display_links = ('name',)
    search_fields = ('name', 'email', 'phone', 'address')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'updated_at', 'employees_count_display')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'email', 'phone', 'address')
        }),
        ('Логотип', {
            'fields': ('avatar',)
        }),
        ('Системная информация', {
            'fields': ('employees_count_display', 'created_at', 'updated_at')
        }),
    )
    
    def employees_count(self, obj):
        """Количество сотрудников для списка"""
        from users.models import User
        count = User.objects.filter(organization=obj).count()
        if count > 0:
            return format_html('<span style="color: green; font-weight: bold;">{}</span>', count)
        return format_html('<span style="color: gray;">{}</span>', count)
    employees_count.short_description = 'Сотрудники'
    
    def employees_count_display(self, obj):
        """Детальная информация о сотрудниках"""
        from users.models import User
        count = User.objects.filter(organization=obj).count()
        return format_html(
            '<span style="font-size: 16px; font-weight: bold; color: {};">{} сотрудников</span>',
            'green' if count > 0 else 'gray',
            count
        )
    employees_count_display.short_description = 'Количество сотрудников'
    
    def delete_model(self, request, obj):
        """Проверка при удалении одной организации"""
        from users.models import User
        employees_count = User.objects.filter(organization=obj).count()
        
        if employees_count > 0:
            messages.error(
                request,
                f'❌ Невозможно удалить организацию "{obj.name}". '
                f'У неё есть {employees_count} сотрудник(ов). '
                f'Сначала переместите или удалите пользователей.'
            )
            return
        
        super().delete_model(request, obj)
        messages.success(request, f'✅ Организация "{obj.name}" успешно удалена.')
    
    def delete_queryset(self, request, queryset):
        """Проверка при массовом удалении"""
        from users.models import User
        
        # Проверяем каждую организацию
        organisations_with_employees = []
        organisations_to_delete = []
        
        for org in queryset:
            employees_count = User.objects.filter(organization=org).count()
            if employees_count > 0:
                organisations_with_employees.append(f'{org.name} ({employees_count} сотр.)')
            else:
                organisations_to_delete.append(org)
        
        if organisations_with_employees:
            messages.error(
                request,
                f'❌ Невозможно удалить организации с сотрудниками: {", ".join(organisations_with_employees)}. '
                f'Сначала переместите или удалите пользователей.'
            )
            if organisations_to_delete:
                messages.warning(
                    request,
                    f'⚠️ Остальные организации можно удалить по отдельности.'
                )
            return
        
        # Удаляем только пустые организации
        count = len(organisations_to_delete)
        for org in organisations_to_delete:
            org.delete()
        
        messages.success(request, f'✅ Успешно удалено организаций: {count}')


admin.site.register(Department)
admin.site.register(Section)