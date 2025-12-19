from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Appeal


@admin.register(Appeal)
class AppealAdmin(admin.ModelAdmin):
    """Админка для обращений"""
    
    list_display = [
        'id',
        'user_display',
        'subject_short',
        'status_badge',
        'is_anonymous',
        'created_at',
        'updated_at',
    ]
    
    list_filter = [
        'status',
        'is_anonymous',
        'created_at',
        'updated_at',
    ]
    
    search_fields = [
        'subject',
        'message',
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
    ]
    
    readonly_fields = [
        'user',
        'created_at',
        'updated_at',
        'resolved_at',
        'resolved_by',
    ]
    
    fieldsets = (
        ('Информация о пользователе', {
            'fields': ('user', 'is_anonymous')
        }),
        ('Обращение', {
            'fields': ('language', 'subject', 'message')
        }),
        ('Статус и ответ', {
            'fields': ('status', 'admin_response')
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at', 'resolved_by', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def user_display(self, obj):
        """Отображение пользователя"""
        if obj.is_anonymous:
            return format_html(
                '<span style="color: #6b7280; font-style: italic;">🕶️ Аноним</span>'
            )
        user = obj.user
        return format_html(
            '<strong>{}</strong><br/><small>{}</small>',
            user.get_full_name() or user.username,
            user.email
        )
    user_display.short_description = 'Пользователь'
    
    def subject_short(self, obj):
        """Короткое отображение темы"""
        subject = obj.subject
        if len(subject) > 60:
            return f"{subject[:60]}..."
        return subject
    subject_short.short_description = 'Тема'
    
    def status_badge(self, obj):
        """Отображение статуса с цветом"""
        colors = {
            'new': '#3b82f6',  # blue
            'in_progress': '#f59e0b',  # amber
            'resolved': '#10b981',  # green
            'rejected': '#ef4444',  # red
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 10px; font-size: 11px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    
    def has_add_permission(self, request):
        """Запретить создание через админку (только через API)"""
        return False
    
    def save_model(self, request, obj, form, change):
        """Сохранение с автоматическим обновлением resolved_by"""
        if change and 'status' in form.changed_data:
            if obj.status == 'resolved' and not obj.resolved_by:
                from django.utils import timezone
                obj.resolved_by = request.user
                obj.resolved_at = timezone.now()
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        """Оптимизация запросов"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'resolved_by')

