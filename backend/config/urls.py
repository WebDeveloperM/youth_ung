from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from analytics import views_admin as analytics_admin_views
from content.views.statistics import YouthStatisticsView, YouthStatisticsHistoryView
from content.views.statistics_pdf import YouthStatisticsPDFView

schema_view = get_schema_view(
    openapi.Info(
        title="API Schema",
        default_version='v1',
        description="Guide for the REST API",
    ),
    public=True,
    # Важно: не указываем фиксированный URL, чтобы Swagger/Redoc
    # использовали текущий хост (localhost:8000 в вашем случае).
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/analytics/', include('analytics.urls')),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    # path('bot/', include(('bot.urls', 'bot'))),
    path('api/v1/', include([
        path('core/', include(('core.urls', 'core'), namespace='core')),
        path('organisation/', include(('organisation.urls', 'organisation'), namespace='organisation')),
        path('users/', include(('users.urls', 'user'), namespace='users')),
        path('comments/', include('content.urls.comments')),
        path('news/', include('content.urls.news')),  # Публичный API новостей для frontend
        path('grants/', include('content.urls.grants')),  # Публичный API грантов для frontend
        path('scholarships/', include('content.urls.scholarships')),  # Публичный API стипендий для frontend
        path('competitions/', include('content.urls.competitions')),  # Публичный API конкурсов для frontend
        path('innovations/', include('content.urls.innovations')),  # Публичный API инноваций для frontend
        path('internships/', include('content.urls.internships')),  # Публичный API стажировок для frontend
        path('jobs/', include('content.urls.jobs')),  # Публичный API вакансий для frontend
        path('team/', include('content.urls.team')),  # Публичный API команды для frontend
        path('applications/', include('content.urls.applications')),  # Подача заявок
        path('appeals/', include('content.urls.appeals')),  # Обращения пользователей
        path('articles/', include('content.urls.articles')),  # API maqolalar uchun
        path('technologies/', include('content.urls.technologies')),  # Публичный API технологий для frontend
        path('projects/', include('content.urls.projects')),  # Публичный API проектов для frontend
        path('research/', include('content.urls.research')),  # Публичный API исследований для frontend
        path('results/', include('content.urls.results')),  # Публичный API результатов для frontend
        path('organisations/', include('organisation.urls')),  # API организаций (админ + публичный)
        path('statistics/', YouthStatisticsView.as_view(), name='youth-statistics'),  # Статистика молодежи
        path('statistics/history/', YouthStatisticsHistoryView.as_view(), name='youth-statistics-history'),  # История статистики
        path('statistics/export/pdf/', YouthStatisticsPDFView.as_view(), name='youth-statistics-pdf'),  # Экспорт в PDF
        path('admin/', include([
            path('', include('content.urls.admin_urls')),
            path('admins/', include('users.urls_admin')),  # Управление администраторами
            path('all-users/', include('users.urls_all_users')),  # Все зарегистрированные пользователи
            path('analytics/', include([
                path('dashboard/', analytics_admin_views.admin_dashboard_stats),
                path('visitors/', analytics_admin_views.admin_visitors_stats),
                path('pages/', analytics_admin_views.admin_pages_analytics),
            ])),
        ])),
    ])),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
