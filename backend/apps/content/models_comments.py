from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from core.models import BaseModel


class Comment(BaseModel):
    """
    Модель комментария с возможностью привязки к любому типу контента
    (News, Innovation, Grant, Scholarship, Competition, Internship, Job, Project, Research)
    """
    # Автор комментария
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Автор'
    )
    
    # Содержание комментария
    content = models.TextField(verbose_name='Содержание')
    
    # GenericForeignKey для привязки к любому типу контента
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name='Тип контента'
    )
    object_id = models.PositiveIntegerField(verbose_name='ID объекта')
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Лайки и дизлайки
    likes = models.IntegerField(default=0, verbose_name='Лайки')
    dislikes = models.IntegerField(default=0, verbose_name='Дизлайки')
    
    # Пользователи которые лайкнули/дизлайкнули (для предотвращения повторных действий)
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_comments',
        blank=True,
        verbose_name='Лайкнули'
    )
    disliked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='disliked_comments',
        blank=True,
        verbose_name='Дизлайкнули'
    )
    
    # Модерация
    is_moderated = models.BooleanField(default=True, verbose_name='Модерирован')
    is_deleted = models.BooleanField(default=False, verbose_name='Удален')
    
    class Meta:
        db_table = 'comments'
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['author']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f'{self.author.username}: {self.content[:50]}...'
    
    def like(self, user):
        """Лайкнуть комментарий"""
        if not self.liked_by.filter(id=user.id).exists():
            # Убираем дизлайк если был
            if self.disliked_by.filter(id=user.id).exists():
                self.disliked_by.remove(user)
                self.dislikes -= 1
            
            # Добавляем лайк
            self.liked_by.add(user)
            self.likes += 1
            self.save()
            return True
        return False
    
    def dislike(self, user):
        """Дизлайкнуть комментарий"""
        if not self.disliked_by.filter(id=user.id).exists():
            # Убираем лайк если был
            if self.liked_by.filter(id=user.id).exists():
                self.liked_by.remove(user)
                self.likes -= 1
            
            # Добавляем дизлайк
            self.disliked_by.add(user)
            self.dislikes += 1
            self.save()
            return True
        return False
    
    def unlike(self, user):
        """Убрать лайк"""
        if self.liked_by.filter(id=user.id).exists():
            self.liked_by.remove(user)
            self.likes -= 1
            self.save()
            return True
        return False
    
    def undislike(self, user):
        """Убрать дизлайк"""
        if self.disliked_by.filter(id=user.id).exists():
            self.disliked_by.remove(user)
            self.dislikes -= 1
            self.save()
            return True
        return False



