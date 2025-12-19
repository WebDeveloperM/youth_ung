from django.db import models
from core.models import BaseModel


class Appeal(BaseModel):
    """Обращения пользователей"""
    
    STATUS_CHOICES = [
        ('new', 'Новое'),
        ('in_progress', 'В работе'),
        ('resolved', 'Решено'),
        ('rejected', 'Отклонено'),
    ]
    
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='appeals',
        verbose_name="Пользователь"
    )
    
    # Язык обращения
    language = models.CharField(
        max_length=2,
        choices=[('uz', 'O\'zbekcha'), ('ru', 'Русский'), ('en', 'English')],
        default='uz',
        verbose_name="Язык обращения"
    )
    
    # Одноязычные поля
    subject = models.CharField(max_length=500, verbose_name="Тема")
    message = models.TextField(verbose_name="Сообщение")
    
    # Анонимность
    is_anonymous = models.BooleanField(default=False, verbose_name="Анонимное обращение")
    
    # Статус
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Статус"
    )
    
    # Ответ администратора
    admin_response = models.TextField(blank=True, verbose_name="Ответ администратора")
    resolved_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_appeals',
        verbose_name="Решено пользователем"
    )
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата решения")
    
    class Meta:
        db_table = 'content_appeals'
        verbose_name = "Обращение"
        verbose_name_plural = "Обращения"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_anonymous']),
        ]
    
    def __str__(self):
        user_display = "Анонимно" if self.is_anonymous else str(self.user)
        return f"{user_display}: {self.subject[:50]}"
    
    def get_display_name(self):
        """Получить отображаемое имя пользователя"""
        if self.is_anonymous:
            return "Аноним"
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username

