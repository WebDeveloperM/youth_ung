from django.contrib import admin
from django.contrib.admin import AdminSite
from django.db.models import Count, Sum
from django.urls import path
from django.shortcuts import render


class CustomAdminSite(AdminSite):
    """Кастомная админка с современным дизайном"""
    
    site_header = "UNG Youth Admin"
    site_title = "UNG Youth"
    index_title = "Dashboard"
    
    def index(self, request, extra_context=None):
        """Кастомная главная страница с статистикой"""
        from users.models import User
        from content.models import News, Innovation, Job
        from content.models_comments import Comment
        from analytics.models import PageView
        
        # Получаем статистику
        stats = {
            'total_users': User.objects.count(),
            'total_news': News.objects.count(),
            'total_innovations': Innovation.objects.count(),
            'total_jobs': Job.objects.count(),
            'total_views': PageView.objects.aggregate(total=Sum('views_count'))['total'] or 0,
            'total_comments': Comment.objects.filter(is_deleted=False).count(),
        }
        
        extra_context = extra_context or {}
        extra_context.update(stats)
        
        return super().index(request, extra_context)


# Создаем экземпляр кастомной админки
custom_admin_site = CustomAdminSite(name='custom_admin')
