from django.db.models import Sum


def dashboard_stats(request):
    """Context processor для статистики в админке"""
    if not request.path.startswith('/admin'):
        return {}
    
    try:
        from users.models import User
        from content.models import News, Innovation, Job
        from content.models_comments import Comment
        from analytics.models import PageView
        
        stats = {
            'total_users': User.objects.count(),
            'total_news': News.objects.count(),
            'total_innovations': Innovation.objects.count(),
            'total_jobs': Job.objects.count(),
            'total_views': PageView.objects.aggregate(total=Sum('views_count'))['total'] or 0,
            'total_comments': Comment.objects.filter(is_deleted=False).count(),
        }
        
        return stats
    except Exception as e:
        print(f"Error in dashboard_stats: {e}")
        return {}



