"""
Модели для заявок на гранты, стипендии, конкурсы и т.д.
"""
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User


class Application(models.Model):
    """Заявка на грант/стипендию/конкурс"""
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает рассмотрения'),
        ('reviewing', 'На рассмотрении'),
        ('approved', 'Одобрена'),
        ('rejected', 'Отклонена'),
    ]
    
    # Пользователь (если зарегистрирован)
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Пользователь"
    )
    
    # Данные заявителя
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    
    # Дополнительная информация
    organization = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Организация/Университет"
    )
    position = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Должность/Специальность"
    )
    experience = models.TextField(blank=True, verbose_name="Опыт")
    motivation = models.TextField(verbose_name="Мотивационное письмо")
    
    # Файлы
    cv_file = models.FileField(
        upload_to='applications/cv/', 
        blank=True, 
        null=True,
        verbose_name="Резюме/CV"
    )
    portfolio_file = models.FileField(
        upload_to='applications/portfolio/', 
        blank=True, 
        null=True,
        verbose_name="Портфолио"
    )
    
    # Связь с грантом/стипендией/конкурсом через GenericForeignKey
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Статус и управление
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name="Статус"
    )
    admin_comment = models.TextField(
        blank=True, 
        verbose_name="Комментарий администратора"
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_applications',
        verbose_name="Рассмотрел"
    )
    reviewed_at = models.DateTimeField(
        null=True, 
        blank=True, 
        verbose_name="Дата рассмотрения"
    )
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата подачи")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        db_table = 'content_applications'
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.full_name} - {self.content_type.model} #{self.object_id}"
    
    @property
    def content_type_name(self):
        """Название типа контента"""
        return self.content_type.model
    
    @property
    def content_title(self):
        """Название гранта/стипендии"""
        if hasattr(self.content_object, 'title_ru'):
            return self.content_object.title_ru
        return str(self.content_object)

