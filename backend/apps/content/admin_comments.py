from django.contrib import admin
from content.models_comments import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'content_preview', 'content_type', 'object_id', 'likes', 'dislikes', 'created_at', 'is_moderated')
    list_filter = ('content_type', 'is_moderated', 'is_deleted', 'created_at')
    search_fields = ('content', 'author__username', 'author__email')
    readonly_fields = ('created_at', 'updated_at', 'likes', 'dislikes')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('author', 'content', 'content_type', 'object_id')
        }),
        ('Статистика', {
            'fields': ('likes', 'dislikes', 'liked_by', 'disliked_by')
        }),
        ('Модерация', {
            'fields': ('is_moderated', 'is_deleted')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ('liked_by', 'disliked_by')
    
    def content_preview(self, obj):
        """Предпросмотр содержания"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Содержание'
    
    def has_add_permission(self, request):
        """Запретить добавление через админку (только через API)"""
        return False



