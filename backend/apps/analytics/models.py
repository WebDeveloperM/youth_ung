from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone
from datetime import timedelta


class Visitor(models.Model):
    """Модель для отслеживания уникальных посетителей"""
    ip_address = models.GenericIPAddressField(verbose_name="IP адрес")
    user_agent = models.TextField(verbose_name="User Agent", blank=True, null=True)
    session_key = models.CharField(max_length=255, verbose_name="Ключ сессии", blank=True, null=True)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, 
                            verbose_name="Пользователь", related_name='visits')
    first_visit = models.DateTimeField(auto_now_add=True, verbose_name="Первое посещение")
    last_visit = models.DateTimeField(auto_now=True, verbose_name="Последнее посещение")
    visit_count = models.IntegerField(default=1, verbose_name="Количество визитов")
    
    # Геолокация (опционально, можно добавить через GeoIP)
    country = models.CharField(max_length=100, blank=True, null=True, verbose_name="Страна")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Город")
    
    # Информация о браузере и устройстве
    browser = models.CharField(max_length=100, blank=True, null=True, verbose_name="Браузер")
    os = models.CharField(max_length=100, blank=True, null=True, verbose_name="ОС")
    device = models.CharField(max_length=50, choices=[
        ('mobile', 'Мобильный'),
        ('tablet', 'Планшет'),
        ('desktop', 'Десктоп'),
    ], default='desktop', verbose_name="Устройство")

    class Meta:
        verbose_name = "Посетитель"
        verbose_name_plural = "Посетители"
        ordering = ['-last_visit']
        indexes = [
            models.Index(fields=['ip_address', 'session_key']),
            models.Index(fields=['last_visit']),
        ]

    def __str__(self):
        if self.user:
            return f"{self.user.username} ({self.ip_address})"
        return f"Гость ({self.ip_address})"


class PageView(models.Model):
    """Модель для отслеживания просмотров страниц"""
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, 
                               related_name='page_views', verbose_name="Посетитель")
    url = models.CharField(max_length=500, verbose_name="URL")
    path = models.CharField(max_length=500, verbose_name="Путь")
    method = models.CharField(max_length=10, default='GET', verbose_name="HTTP метод")
    status_code = models.IntegerField(default=200, verbose_name="Статус код")
    referer = models.CharField(max_length=500, blank=True, null=True, verbose_name="Источник перехода")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Время просмотра", db_index=True)
    
    # Generic relation для связи с любой моделью
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, 
                                     null=True, blank=True, verbose_name="Тип контента")
    object_id = models.PositiveIntegerField(null=True, blank=True, verbose_name="ID объекта")
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Время на странице (в секундах)
    time_spent = models.IntegerField(null=True, blank=True, verbose_name="Время на странице (сек)")

    class Meta:
        verbose_name = "Просмотр страницы"
        verbose_name_plural = "Просмотры страниц"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp', 'path']),
            models.Index(fields=['content_type', 'object_id']),
        ]

    def __str__(self):
        return f"{self.visitor} - {self.path} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"


class ContentStatistics(models.Model):
    """Модель для агрегированной статистики по контенту"""
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, verbose_name="Тип контента")
    object_id = models.PositiveIntegerField(verbose_name="ID объекта")
    content_object = GenericForeignKey('content_type', 'object_id')
    
    date = models.DateField(verbose_name="Дата", db_index=True)
    views_count = models.IntegerField(default=0, verbose_name="Просмотры")
    unique_visitors = models.IntegerField(default=0, verbose_name="Уникальные посетители")
    likes_count = models.IntegerField(default=0, verbose_name="Лайки")
    shares_count = models.IntegerField(default=0, verbose_name="Поделились")
    
    class Meta:
        verbose_name = "Статистика контента"
        verbose_name_plural = "Статистика контента"
        unique_together = [['content_type', 'object_id', 'date']]
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date', 'content_type']),
        ]

    def __str__(self):
        return f"{self.content_type} #{self.object_id} - {self.date}"


class UserActivity(models.Model):
    """Модель для отслеживания активности пользователей (админов)"""
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, 
                            related_name='activities', verbose_name="Пользователь")
    action = models.CharField(max_length=50, choices=[
        ('create', 'Создание'),
        ('update', 'Обновление'),
        ('delete', 'Удаление'),
        ('view', 'Просмотр'),
        ('login', 'Вход'),
        ('logout', 'Выход'),
    ], verbose_name="Действие")
    
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, 
                                     null=True, blank=True, verbose_name="Тип контента")
    object_id = models.PositiveIntegerField(null=True, blank=True, verbose_name="ID объекта")
    content_object = GenericForeignKey('content_type', 'object_id')
    
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Время", db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP адрес")
    
    class Meta:
        verbose_name = "Активность пользователя"
        verbose_name_plural = "Активность пользователей"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.get_action_display()} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"


class DailyStats(models.Model):
    """Модель для ежедневной агрегированной статистики"""
    date = models.DateField(unique=True, verbose_name="Дата", db_index=True)
    
    # Статистика посетителей
    total_visitors = models.IntegerField(default=0, verbose_name="Всего посетителей")
    unique_visitors = models.IntegerField(default=0, verbose_name="Уникальные посетители")
    new_visitors = models.IntegerField(default=0, verbose_name="Новые посетители")
    returning_visitors = models.IntegerField(default=0, verbose_name="Возвращающиеся посетители")
    
    # Статистика просмотров
    total_pageviews = models.IntegerField(default=0, verbose_name="Всего просмотров страниц")
    avg_pages_per_visitor = models.FloatField(default=0, verbose_name="Среднее страниц на посетителя")
    avg_time_on_site = models.FloatField(default=0, verbose_name="Среднее время на сайте (мин)")
    bounce_rate = models.FloatField(default=0, verbose_name="Показатель отказов (%)")
    
    # Статистика публикаций
    news_published = models.IntegerField(default=0, verbose_name="Опубликовано новостей")
    grants_published = models.IntegerField(default=0, verbose_name="Опубликовано грантов")
    scholarships_published = models.IntegerField(default=0, verbose_name="Опубликовано стипендий")
    competitions_published = models.IntegerField(default=0, verbose_name="Опубликовано конкурсов")
    innovations_published = models.IntegerField(default=0, verbose_name="Опубликовано инноваций")
    internships_published = models.IntegerField(default=0, verbose_name="Опубликовано стажировок")
    jobs_published = models.IntegerField(default=0, verbose_name="Опубликовано вакансий")
    
    # Устройства
    mobile_visitors = models.IntegerField(default=0, verbose_name="Мобильные посетители")
    tablet_visitors = models.IntegerField(default=0, verbose_name="Планшетные посетители")
    desktop_visitors = models.IntegerField(default=0, verbose_name="Десктопные посетители")
    
    class Meta:
        verbose_name = "Ежедневная статистика"
        verbose_name_plural = "Ежедневная статистика"
        ordering = ['-date']

    def __str__(self):
        return f"Статистика за {self.date}"



