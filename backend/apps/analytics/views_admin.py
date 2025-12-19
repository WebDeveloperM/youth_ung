from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from users.utils.authentication import CustomTokenAuthentication
from users.models import User
from content.models import News, Grant, Scholarship, Competition, Innovation, Internship, Job
from content.models_comments import Comment
from analytics.models import PageView, Visitor, DailyStats


@api_view(['GET'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """Статистика для главной страницы админки"""
    
    # Проверка роли
    if request.user.role not in ['Admin', 'Moderator', 'Coordinator']:
        return Response({'error': 'Permission denied'}, status=403)
    
    # Подсчет контента
    stats = {
        'total_users': User.objects.count(),
        'total_news': News.objects.count(),
        'total_innovations': Innovation.objects.count(),
        'total_grants': Grant.objects.count(),
        'total_scholarships': Scholarship.objects.count(),
        'total_competitions': Competition.objects.count(),
        'total_internships': Internship.objects.count(),
        'total_jobs': Job.objects.count(),
        'total_views': PageView.objects.count(),
        'total_comments': Comment.objects.filter(is_deleted=False).count(),
        'pending_comments': Comment.objects.filter(is_moderated=False, is_deleted=False).count(),
    }
    
    # Рост за последний месяц (примерный)
    month_ago = timezone.now() - timedelta(days=30)
    
    users_last_month = User.objects.filter(date_joined__gte=month_ago).count()
    all_users = stats['total_users']
    stats['user_growth'] = round((users_last_month / all_users * 100) if all_users > 0 else 0, 1)
    
    # Рост контента (все типы)
    content_last_month = (
        News.objects.filter(created_at__gte=month_ago).count() +
        Innovation.objects.filter(created_at__gte=month_ago).count() +
        Grant.objects.filter(created_at__gte=month_ago).count()
    )
    all_content = stats['total_news'] + stats['total_innovations'] + stats['total_grants']
    stats['content_growth'] = round((content_last_month / all_content * 100) if all_content > 0 else 0, 1)
    
    # Рост просмотров
    views_last_month = PageView.objects.filter(timestamp__gte=month_ago).count()
    stats['views_growth'] = round((views_last_month / stats['total_views'] * 100) if stats['total_views'] > 0 else 0, 1)
    
    return Response(stats)


@api_view(['GET'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_visitors_stats(request):
    """Статистика посетителей"""
    
    if request.user.role not in ['Admin', 'Moderator', 'Coordinator']:
        return Response({'error': 'Permission denied'}, status=403)
    
    # Период (по умолчанию месяц)
    period = request.GET.get('period', 'month')
    
    if period == 'today':
        start_date = timezone.now().date()
    elif period == 'week':
        start_date = timezone.now().date() - timedelta(days=7)
    elif period == 'year':
        start_date = timezone.now().date() - timedelta(days=365)
    else:  # month
        start_date = timezone.now().date() - timedelta(days=30)
    
    # Получаем ежедневную статистику
    daily_stats = DailyStats.objects.filter(date__gte=start_date).order_by('date')
    
    daily = []
    for stat in daily_stats:
        daily.append({
            'date': stat.date.isoformat(),
            'visitors': stat.total_visitors,
            'pageViews': stat.total_pageviews,
            'uniqueVisitors': stat.unique_visitors,
        })
    
    # Общая статистика
    totals = daily_stats.aggregate(
        total=Sum('total_visitors'),
        unique=Sum('unique_visitors'),
        new=Sum('new_visitors'),
        returning=Sum('returning_visitors'),
        avg_pages=Avg('avg_pages_per_visitor'),
        avg_time=Avg('avg_time_on_site'),
        bounce=Avg('bounce_rate'),
    )
    
    return Response({
        'daily': daily,
        'total_visitors': totals['total'] or 0,
        'unique_visitors': totals['unique'] or 0,
        'new_visitors': totals['new'] or 0,
        'returning_visitors': totals['returning'] or 0,
        'avg_pages_per_visitor': round(totals['avg_pages'] or 0, 2),
        'avg_time_on_site': round(totals['avg_time'] or 0, 2),
        'bounce_rate': round(totals['bounce'] or 0, 2),
    })


@api_view(['GET'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_pages_analytics(request):
    """Аналитика страниц"""
    
    if request.user.role not in ['Admin', 'Moderator', 'Coordinator']:
        return Response({'error': 'Permission denied'}, status=403)
    
    # Топ страниц по просмотрам
    pages = PageView.objects.values('path').annotate(
        views=Count('id'),
        unique=Count('visitor', distinct=True),
    ).order_by('-views')[:10]
    
    result = []
    for page in pages:
        result.append({
            'page': page['path'],
            'views': page['views'],
            'uniqueVisitors': page['unique'],
            'avgDuration': '5:30',  # TODO: Calculate real duration
            'bounceRate': 45.5,  # TODO: Calculate real bounce rate
        })
    
    return Response(result)


