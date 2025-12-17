from django.contrib import admin

# Import Comment admin
from .admin_comments import CommentAdmin
# Import Application admin
from .admin_applications import ApplicationAdmin
from django.utils.html import format_html
from django.db.models import Count, Q
from django.utils.translation import gettext_lazy as _
from .models import (
    News, Grant, Scholarship, Competition, Innovation,
    Internship, Job, TeamMember, AboutPage, Article
)


class BaseContentAdmin(admin.ModelAdmin):
    """Базовый класс для админки контента"""
    
    list_per_page = 25
    date_hierarchy = 'created_at'
    save_on_top = True
    
    def get_list_display_links(self, request, list_display):
        """Делаем первые 2 колонки кликабельными"""
        return list(list_display)[:2]
    
    def get_changeform_initial_data(self, request):
        """Установка начальных данных при создании"""
        initial = super().get_changeform_initial_data(request)
        initial['created_by'] = request.user
        return initial


@admin.register(News)
class NewsAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'image_preview', 'date', 'views_count', 'likes_count', 'status_badge', 'is_published', 'is_featured', 'created_at']
    list_filter = ['is_published', 'is_featured', 'date', 'created_at']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'content_uz', 'content_ru', 'content_en']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at', 'views', 'likes']
    list_editable = ['is_published', 'is_featured']
    
    fieldsets = (
        ('📰 Основная информация', {
            'fields': ('date', 'image', 'image_preview_large', ('is_published', 'is_featured'))
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': (('views', 'likes'), 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['publish_news', 'unpublish_news', 'mark_as_featured', 'increment_views']
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz or obj.title_en
    title_display.short_description = 'Заголовок'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return '—'
    image_preview.short_description = 'Превью'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'
    
    def views_count(self, obj):
        return format_html('<span style="color: #3b82f6;">👁 {}</span>', obj.views)
    views_count.short_description = 'Просмотры'
    views_count.admin_order_field = 'views'
    
    def likes_count(self, obj):
        return format_html('<span style="color: #ec4899;">❤️ {}</span>', obj.likes)
    likes_count.short_description = 'Лайки'
    likes_count.admin_order_field = 'likes'
    
    def status_badge(self, obj):
        if obj.is_published:
            return format_html('<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">✓ Опубликовано</span>')
        return format_html('<span style="background: #6b7280; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">○ Черновик</span>')
    status_badge.short_description = 'Статус'
    
    @admin.action(description='✓ Опубликовать выбранные новости')
    def publish_news(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'Опубликовано новостей: {updated}')
    
    @admin.action(description='✗ Снять с публикации')
    def unpublish_news(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'Снято с публикации: {updated}')
    
    @admin.action(description='⭐ Отметить как избранное')
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'Отмечено как избранное: {updated}')
    
    @admin.action(description='👁 Увеличить просмотры на 100')
    def increment_views(self, request, queryset):
        for news in queryset:
            news.views += 100
            news.save()
        self.message_user(request, f'Просмотры увеличены для {queryset.count()} новостей')


@admin.register(Grant)
class GrantAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'amount', 'deadline', 'category_badge', 'status_badge', 'applicants_count']
    list_filter = ['status', 'category', 'deadline', 'created_at']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'short_description_ru']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at', 'applicants']
    
    fieldsets = (
        ('💰 Основная информация', {
            'fields': ('amount', 'duration', 'deadline', ('status', 'category'), 'image', 'image_preview_large')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'short_description_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'short_description_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'short_description_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': ('applicants', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_grants', 'close_grants']
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def category_badge(self, obj):
        colors = {
            'innovation': '#3b82f6',
            'ecology': '#10b981',
            'digital': '#8b5cf6',
            'social': '#ec4899'
        }
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def status_badge(self, obj):
        colors = {'active': '#10b981', 'closed': '#ef4444', 'upcoming': '#f59e0b'}
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Статус'
    
    def applicants_count(self, obj):
        return format_html('<span style="color: #3b82f6; font-weight: bold;">{} чел.</span>', obj.applicants)
    applicants_count.short_description = 'Заявки'
    applicants_count.admin_order_field = 'applicants'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'
    
    @admin.action(description='✓ Активировать гранты')
    def activate_grants(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'Активировано грантов: {updated}')
    
    @admin.action(description='✗ Закрыть гранты')
    def close_grants(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'Закрыто грантов: {updated}')


@admin.register(Scholarship)
class ScholarshipAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'amount', 'deadline', 'category_badge', 'status_badge', 'recipients_count']
    list_filter = ['status', 'category', 'deadline', 'created_at']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    
    fieldsets = (
        ('🎓 Основная информация', {
            'fields': ('amount', 'duration', 'deadline', ('status', 'category'), 'image', 'image_preview_large')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'short_description_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'short_description_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'short_description_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': ('recipients', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def category_badge(self, obj):
        colors = {
            'master': '#3b82f6',
            'certification': '#10b981',
            'language': '#f59e0b',
            'professional': '#8b5cf6'
        }
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def status_badge(self, obj):
        colors = {'active': '#10b981', 'closed': '#ef4444', 'upcoming': '#f59e0b'}
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Статус'
    
    def recipients_count(self, obj):
        return format_html('<span style="color: #10b981; font-weight: bold;">{} чел.</span>', obj.recipients)
    recipients_count.short_description = 'Стипендиатов'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'


@admin.register(Competition)
class CompetitionAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'date_range', 'category_badge', 'status_badge', 'participants_count', 'prize']
    list_filter = ['status', 'category', 'start_date', 'end_date']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'prize']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    
    fieldsets = (
        ('🏆 Основная информация', {
            'fields': (('start_date', 'end_date'), 'registration_deadline', 'prize', ('status', 'category'), 'image', 'image_preview_large')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'short_description_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'short_description_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'short_description_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': ('participants', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def date_range(self, obj):
        return format_html('📅 {} - {}', obj.start_date.strftime('%d.%m.%Y'), obj.end_date.strftime('%d.%m.%Y'))
    date_range.short_description = 'Период'
    
    def category_badge(self, obj):
        colors = {
            'professional': '#3b82f6',
            'innovation': '#10b981',
            'sports': '#f59e0b',
            'social': '#8b5cf6'
        }
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def status_badge(self, obj):
        colors = {'active': '#10b981', 'upcoming': '#f59e0b', 'closed': '#ef4444'}
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Статус'
    
    def participants_count(self, obj):
        return format_html('<span style="color: #3b82f6; font-weight: bold;">{} чел.</span>', obj.participants)
    participants_count.short_description = 'Участники'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'


@admin.register(Innovation)
class InnovationAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'image_preview', 'date', 'category_badge', 'views_count', 'likes_count', 'is_featured', 'featured_badge']
    list_filter = ['category', 'is_featured', 'date', 'created_at']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    list_editable = ['is_featured']
    
    fieldsets = (
        ('💡 Основная информация', {
            'fields': ('date', 'category', 'image', 'image_preview_large', 'is_featured')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': (('views', 'likes'), 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return '—'
    image_preview.short_description = 'Превью'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'
    
    def category_badge(self, obj):
        colors = {'technology': '#3b82f6', 'ecology': '#10b981', 'digital': '#8b5cf6'}
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def views_count(self, obj):
        return format_html('<span style="color: #3b82f6;">👁 {}</span>', obj.views)
    views_count.short_description = 'Просмотры'
    
    def likes_count(self, obj):
        return format_html('<span style="color: #ec4899;">❤️ {}</span>', obj.likes)
    likes_count.short_description = 'Лайки'
    
    def featured_badge(self, obj):
        if obj.is_featured:
            return format_html('<span style="color: #f59e0b; font-size: 18px;">⭐</span>')
        return '—'
    featured_badge.short_description = 'Избранное'


@admin.register(Internship)
class InternshipAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'stipend', 'duration', 'deadline', 'category_badge', 'status_badge', 'applicants_positions']
    list_filter = ['status', 'category', 'deadline', 'start_date']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    
    fieldsets = (
        ('🎯 Основная информация', {
            'fields': ('stipend', 'duration', ('deadline', 'start_date'), ('status', 'category'), ('positions', 'applicants'), 'image', 'image_preview_large')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'short_description_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'short_description_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'short_description_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def category_badge(self, obj):
        colors = {'summer': '#f59e0b', 'international': '#3b82f6', 'technical': '#8b5cf6'}
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def status_badge(self, obj):
        colors = {'active': '#10b981', 'closed': '#ef4444', 'upcoming': '#f59e0b'}
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Статус'
    
    def applicants_positions(self, obj):
        return format_html('<span style="color: #3b82f6; font-weight: bold;">{} / {}</span>', obj.applicants, obj.positions)
    applicants_positions.short_description = 'Заявки/Места'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'


@admin.register(Job)
class JobAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'salary', 'location', 'category_badge', 'employment_type_badge', 'status_badge', 'applicants_positions']
    list_filter = ['status', 'category', 'employment_type', 'location', 'deadline']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'location', 'salary']
    readonly_fields = ['image_preview_large', 'created_at', 'updated_at']
    
    fieldsets = (
        ('💼 Основная информация', {
            'fields': ('salary', 'location', 'type', 'experience', 'deadline', ('status', 'category'), 'employment_type', ('positions', 'applicants'), 'image', 'image_preview_large')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'short_description_uz', 'content_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'short_description_ru', 'content_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'short_description_en', 'content_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_jobs', 'close_jobs', 'pause_jobs']
    
    def title_display(self, obj):
        return obj.title_ru or obj.title_uz
    title_display.short_description = 'Название'
    
    def category_badge(self, obj):
        colors = {
            'it': '#3b82f6',
            'engineering': '#10b981',
            'hr': '#f59e0b',
            'marketing': '#ec4899',
            'finance': '#8b5cf6'
        }
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Категория'
    
    def employment_type_badge(self, obj):
        colors = {
            'full-time': '#10b981',
            'part-time': '#f59e0b',
            'contract': '#3b82f6',
            'intern': '#8b5cf6'
        }
        color = colors.get(obj.employment_type, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_employment_type_display())
    employment_type_badge.short_description = 'Тип'
    
    def status_badge(self, obj):
        colors = {'active': '#10b981', 'closed': '#ef4444', 'paused': '#f59e0b'}
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Статус'
    
    def applicants_positions(self, obj):
        return format_html('<span style="color: #3b82f6; font-weight: bold;">{} / {}</span>', obj.applicants, obj.positions)
    applicants_positions.short_description = 'Заявки/Позиции'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.image.url)
        return '—'
    image_preview_large.short_description = 'Изображение'
    
    @admin.action(description='✓ Активировать вакансии')
    def activate_jobs(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'Активировано вакансий: {updated}')
    
    @admin.action(description='✗ Закрыть вакансии')
    def close_jobs(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'Закрыто вакансий: {updated}')
    
    @admin.action(description='⏸ Приостановить вакансии')
    def pause_jobs(self, request, queryset):
        updated = queryset.update(status='paused')
        self.message_user(request, f'Приостановлено вакансий: {updated}')


@admin.register(TeamMember)
class TeamMemberAdmin(BaseContentAdmin):
    list_display = ['id', 'photo_preview', 'name_display', 'position_display', 'contacts', 'is_active', 'order']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name_uz', 'name_ru', 'name_en', 'position_uz', 'position_ru', 'email']
    readonly_fields = ['photo_preview_large', 'created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    
    fieldsets = (
        ('👤 Основная информация', {
            'fields': ('photo', 'photo_preview_large', 'order', 'is_active')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('name_uz', 'position_uz', 'bio_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('name_ru', 'position_ru', 'bio_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('name_en', 'position_en', 'bio_en'),
            'classes': ('collapse',)
        }),
        ('📞 Контакты', {
            'fields': (('email', 'phone'), ('linkedin', 'telegram')),
        }),
        ('📊 Дополнительно', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def name_display(self, obj):
        return obj.name_ru or obj.name_uz
    name_display.short_description = 'ФИО'
    
    def position_display(self, obj):
        return obj.position_ru or obj.position_uz
    position_display.short_description = 'Должность'
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" />', obj.photo.url)
        return '—'
    photo_preview.short_description = 'Фото'
    
    def photo_preview_large(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="max-width: 200px; border-radius: 8px;" />', obj.photo.url)
        return '—'
    photo_preview_large.short_description = 'Фото'
    
    def contacts(self, obj):
        parts = []
        if obj.email:
            parts.append(format_html('📧 {}', obj.email))
        if obj.phone:
            parts.append(format_html('📱 {}', obj.phone))
        return format_html('<br/>'.join(parts)) if parts else '—'
    contacts.short_description = 'Контакты'


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    readonly_fields = ['hero_image_preview', 'logo_preview', 'created_at', 'updated_at']
    
    fieldsets = (
        ('📝 Общая информация', {
            'fields': (('hero_image', 'hero_image_preview'), ('logo', 'logo_preview'))
        }),
        ('🇺🇿 О компании (Узбекский)', {
            'fields': ('about_uz', 'mission_uz', 'vision_uz', 'history_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 О компании (Русский)', {
            'fields': ('about_ru', 'mission_ru', 'vision_ru', 'history_ru'),
        }),
        ('🇬🇧 О компании (Английский)', {
            'fields': ('about_en', 'mission_en', 'vision_en', 'history_en'),
            'classes': ('collapse',)
        }),
        ('📊 Статистика компании', {
            'fields': ('employees_count', 'projects_count', 'years_experience'),
        }),
        ('📞 Контакты', {
            'fields': ('email', 'phone', 'address_uz', 'address_ru', 'address_en'),
        }),
        ('🌐 Социальные сети', {
            'fields': ('facebook', 'instagram', 'linkedin', 'telegram', 'youtube'),
        }),
        ('🕐 Дополнительно', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def hero_image_preview(self, obj):
        if obj.hero_image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.hero_image.url)
        return '—'
    hero_image_preview.short_description = 'Превью главного изображения'
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-width: 200px; border-radius: 8px;" />', obj.logo.url)
        return '—'
    logo_preview.short_description = 'Превью логотипа'
    
    def has_add_permission(self, request):
        # Разрешаем добавление только если записи нет
        return not AboutPage.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление
        return False


@admin.register(Article)
class ArticleAdmin(BaseContentAdmin):
    list_display = ['id', 'title_display', 'author_name', 'category_badge', 'status_badge', 'is_published', 'views_downloads', 'created_at']
    list_filter = ['status', 'category', 'is_published', 'is_featured', 'created_at']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'author__username', 'author__email', 'keywords_uz', 'keywords_ru']
    readonly_fields = ['cover_preview_large', 'author_info', 'approved_by_info', 'stats_display', 'created_at', 'updated_at', 'views', 'downloads', 'likes']
    list_editable = ['is_published']
    
    fieldsets = (
        ('📄 Основная информация', {
            'fields': ('author_info', 'category', ('status', 'admin_comment'), ('is_published', 'is_featured'), 'cover_image', 'cover_preview_large', 'pdf_file')
        }),
        ('🇺🇿 Узбекский', {
            'fields': ('title_uz', 'abstract_uz', 'content_uz', 'keywords_uz'),
            'classes': ('collapse',)
        }),
        ('🇷🇺 Русский', {
            'fields': ('title_ru', 'abstract_ru', 'content_ru', 'keywords_ru'),
        }),
        ('🇬🇧 Английский', {
            'fields': ('title_en', 'abstract_en', 'content_en', 'keywords_en'),
            'classes': ('collapse',)
        }),
        ('📊 Дополнительно', {
            'fields': ('doi', 'publication_date', 'approved_by_info', 'approved_at'),
            'classes': ('collapse',)
        }),
        ('📈 Статистика', {
            'fields': ('stats_display', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_articles', 'reject_articles', 'publish_articles', 'unpublish_articles']
    
    def title_display(self, obj):
        return (obj.title_ru or obj.title_uz or obj.title_en)[:60]
    title_display.short_description = 'Sarlavha'
    
    def author_name(self, obj):
        name = f"{obj.author.first_name} {obj.author.last_name}" if obj.author.first_name else obj.author.username
        return format_html('<span style="color: #3b82f6;">👤 {}</span>', name)
    author_name.short_description = 'Muallif'
    author_name.admin_order_field = 'author__username'
    
    def author_info(self, obj):
        if obj.author:
            info = f"<strong>{obj.author.username}</strong><br/>"
            if obj.author.first_name:
                info += f"👤 {obj.author.first_name} {obj.author.last_name}<br/>"
            info += f"📧 {obj.author.email}"
            return format_html(info)
        return '—'
    author_info.short_description = 'Muallif haqida'
    
    def approved_by_info(self, obj):
        if obj.approved_by:
            name = f"{obj.approved_by.first_name} {obj.approved_by.last_name}" if obj.approved_by.first_name else obj.approved_by.username
            return format_html('<span style="color: #10b981;">✓ {}</span>', name)
        return '—'
    approved_by_info.short_description = 'Tasdiqlagan'
    
    def category_badge(self, obj):
        colors = {
            'international': '#3b82f6',
            'local': '#10b981',
            'scientific': '#8b5cf6',
            'analytical': '#f59e0b',
            'practical': '#ec4899'
        }
        color = colors.get(obj.category, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_category_display())
    category_badge.short_description = 'Kategoriya'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'approved': '#10b981',
            'rejected': '#ef4444',
            'revision': '#3b82f6'
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px;">{}</span>', 
                          color, obj.get_status_display())
    status_badge.short_description = 'Holati'
    
    def views_downloads(self, obj):
        return format_html('👁 {} | 📥 {}', obj.views, obj.downloads)
    views_downloads.short_description = 'Ko\'rishlar / Yuklab olishlar'
    
    def stats_display(self, obj):
        return format_html(
            '<strong>Ko\'rishlar:</strong> {} | <strong>Yuklab olishlar:</strong> {} | <strong>Yoqishlar:</strong> {}',
            obj.views, obj.downloads, obj.likes
        )
    stats_display.short_description = 'Statistika'
    
    def cover_preview_large(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="max-width: 400px; border-radius: 8px;" />', obj.cover_image.url)
        return '—'
    cover_preview_large.short_description = 'Muqova rasmi'
    
    @admin.action(description='✓ Tasdiqlash')
    def approve_articles(self, request, queryset):
        from django.utils import timezone
        updated = queryset.filter(status='pending').update(
            status='approved',
            is_published=True,
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f'Tasdiqlandi: {updated} ta maqola')
    
    @admin.action(description='✗ Rad etish')
    def reject_articles(self, request, queryset):
        updated = queryset.update(status='rejected', is_published=False)
        self.message_user(request, f'Rad etildi: {updated} ta maqola')
    
    @admin.action(description='📢 Nashr qilish')
    def publish_articles(self, request, queryset):
        updated = queryset.filter(status='approved').update(is_published=True)
        self.message_user(request, f'Nashr qilindi: {updated} ta maqola')
    
    @admin.action(description='📴 Nashrdan olib tashlash')
    def unpublish_articles(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'Nashrdan olib tashlandi: {updated} ta maqola')

