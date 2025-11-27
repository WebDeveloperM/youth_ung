from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Visitor, PageView, ContentStatistics, UserActivity, DailyStats
from content.models import News, Grant, Scholarship, Competition, Innovation, Internship, Job


@staff_member_required
def analytics_dashboard(request):
    """Главная страница дашборда с аналитикой"""
    # Получаем временные диапазоны
    now = timezone.now()
    today = now.date()
    yesterday = today - timedelta(days=1)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Статистика посетителей
    visitors_today = Visitor.objects.filter(last_visit__date=today).count()
    visitors_yesterday = Visitor.objects.filter(last_visit__date=yesterday).count()
    visitors_week = Visitor.objects.filter(last_visit__date__gte=week_ago).count()
    visitors_month = Visitor.objects.filter(last_visit__date__gte=month_ago).count()
    
    unique_visitors_today = Visitor.objects.filter(
        page_views__timestamp__date=today
    ).distinct().count()
    
    # Статистика просмотров
    pageviews_today = PageView.objects.filter(timestamp__date=today).count()
    pageviews_week = PageView.objects.filter(timestamp__gte=week_ago).count()
    pageviews_month = PageView.objects.filter(timestamp__gte=month_ago).count()
    
    # Среднее время на сайте
    avg_time_today = PageView.objects.filter(
        timestamp__date=today,
        time_spent__isnull=False
    ).aggregate(Avg('time_spent'))['time_spent__avg'] or 0
    
    # Статистика по устройствам (за последние 30 дней)
    device_stats = Visitor.objects.filter(
        last_visit__date__gte=month_ago
    ).values('device').annotate(count=Count('id'))
    
    # Статистика по браузерам
    browser_stats = Visitor.objects.filter(
        last_visit__date__gte=month_ago
    ).values('browser').annotate(count=Count('id')).order_by('-count')[:5]
    
    # Статистика публикаций за сегодня
    publications_today = {
        'news': News.objects.filter(date=today).count(),
        'grants': Grant.objects.filter(created_at__date=today).count(),
        'scholarships': Scholarship.objects.filter(created_at__date=today).count(),
        'competitions': Competition.objects.filter(created_at__date=today).count(),
        'innovations': Innovation.objects.filter(created_at__date=today).count(),
        'internships': Internship.objects.filter(created_at__date=today).count(),
        'jobs': Job.objects.filter(created_at__date=today).count(),
    }
    
    # Статистика публикаций за неделю
    publications_week = {
        'news': News.objects.filter(date__gte=week_ago).count(),
        'grants': Grant.objects.filter(created_at__date__gte=week_ago).count(),
        'scholarships': Scholarship.objects.filter(created_at__date__gte=week_ago).count(),
        'competitions': Competition.objects.filter(created_at__date__gte=week_ago).count(),
        'innovations': Innovation.objects.filter(created_at__date__gte=week_ago).count(),
        'internships': Internship.objects.filter(created_at__date__gte=week_ago).count(),
        'jobs': Job.objects.filter(created_at__date__gte=week_ago).count(),
    }
    
    # Статистика публикаций за месяц
    publications_month = {
        'news': News.objects.filter(date__gte=month_ago).count(),
        'grants': Grant.objects.filter(created_at__date__gte=month_ago).count(),
        'scholarships': Scholarship.objects.filter(created_at__date__gte=month_ago).count(),
        'competitions': Competition.objects.filter(created_at__date__gte=month_ago).count(),
        'innovations': Innovation.objects.filter(created_at__date__gte=month_ago).count(),
        'internships': Internship.objects.filter(created_at__date__gte=month_ago).count(),
        'jobs': Job.objects.filter(created_at__date__gte=month_ago).count(),
    }
    
    # Топ контента по просмотрам (за последние 7 дней)
    top_news = News.objects.filter(
        date__gte=week_ago
    ).order_by('-views')[:5]
    
    top_innovations = Innovation.objects.filter(
        date__gte=week_ago
    ).order_by('-views')[:5]
    
    # Активность пользователей (за последние 7 дней)
    user_activities = UserActivity.objects.filter(
        timestamp__gte=week_ago
    ).select_related('user').order_by('-timestamp')[:10]
    
    # Топ авторов по публикациям (за месяц)
    top_authors = UserActivity.objects.filter(
        timestamp__gte=month_ago,
        action='create'
    ).values('user__username').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    # График посещений за последние 7 дней
    daily_visitors = []
    daily_pageviews = []
    dates = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        dates.append(date.strftime('%d.%m'))
        visitors = Visitor.objects.filter(last_visit__date=date).count()
        pageviews = PageView.objects.filter(timestamp__date=date).count()
        daily_visitors.append(visitors)
        daily_pageviews.append(pageviews)
    
    # Данные для графика публикаций за последние 7 дней
    daily_publications = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        total = (
            News.objects.filter(date=date).count() +
            Grant.objects.filter(created_at__date=date).count() +
            Scholarship.objects.filter(created_at__date=date).count() +
            Competition.objects.filter(created_at__date=date).count() +
            Innovation.objects.filter(created_at__date=date).count() +
            Internship.objects.filter(created_at__date=date).count() +
            Job.objects.filter(created_at__date=date).count()
        )
        daily_publications.append(total)
    
    context = {
        'title': 'Дашборд аналитики',
        'site_header': 'UNG Youth Analytics',
        'site_title': 'Аналитика',
        
        # Основная статистика
        'visitors_today': visitors_today,
        'visitors_yesterday': visitors_yesterday,
        'visitors_week': visitors_week,
        'visitors_month': visitors_month,
        'unique_visitors_today': unique_visitors_today,
        
        'pageviews_today': pageviews_today,
        'pageviews_week': pageviews_week,
        'pageviews_month': pageviews_month,
        
        'avg_time_today': round(avg_time_today / 60, 2) if avg_time_today else 0,
        
        # Статистика устройств и браузеров
        'device_stats': list(device_stats),
        'browser_stats': list(browser_stats),
        
        # Статистика публикаций
        'publications_today': publications_today,
        'publications_week': publications_week,
        'publications_month': publications_month,
        'total_publications_today': sum(publications_today.values()),
        'total_publications_week': sum(publications_week.values()),
        'total_publications_month': sum(publications_month.values()),
        
        # Топ контента
        'top_news': top_news,
        'top_innovations': top_innovations,
        
        # Активность
        'user_activities': user_activities,
        'top_authors': top_authors,
        
        # Данные для графиков
        'chart_dates': dates,
        'chart_visitors': daily_visitors,
        'chart_pageviews': daily_pageviews,
        'chart_publications': daily_publications,
    }
    
    return render(request, 'admin/analytics_dashboard.html', context)

