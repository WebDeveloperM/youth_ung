"""
Django admin для заявок
"""
from django.contrib import admin
from django.utils.html import format_html
from .models_applications import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'full_name', 'email', 'phone', 
        'content_info', 'status_badge', 'created_at'
    ]
    list_filter = ['status', 'content_type', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'organization']
    readonly_fields = ['created_at', 'updated_at', 'user', 'content_type', 'object_id']
    list_per_page = 50
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Заявитель', {
            'fields': ('user', 'full_name', 'email', 'phone')
        }),
        ('Дополнительная информация', {
            'fields': ('organization', 'position', 'experience', 'motivation')
        }),
        ('Файлы', {
            'fields': ('cv_file', 'portfolio_file')
        }),
        ('Объект заявки', {
            'fields': ('content_type', 'object_id')
        }),
        ('Управление', {
            'fields': ('status', 'admin_comment', 'reviewed_by', 'reviewed_at')
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_info(self, obj):
        """Информация о контенте"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.content_type_name,
            obj.content_title
        )
    content_info.short_description = 'Объект'
    
    def status_badge(self, obj):
        """Бейдж статуса"""
        colors = {
            'pending': '#FFA500',
            'reviewing': '#0078c2',
            'approved': '#28a745',
            'rejected': '#dc3545',
        }
        return format_html(
            '<span style="padding: 4px 12px; border-radius: 12px; '
            'background-color: {}; color: white; font-weight: bold; font-size: 11px;">{}</span>',
            colors.get(obj.status, '#gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'


