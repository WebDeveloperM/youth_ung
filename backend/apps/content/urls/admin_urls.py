from django.urls import path, include
from rest_framework.routers import DefaultRouter

from content.views.admin_views import (
    NewsAdminViewSet,
    GrantAdminViewSet,
    ScholarshipAdminViewSet,
    CompetitionAdminViewSet,
    InnovationAdminViewSet,
    InternshipAdminViewSet,
    JobAdminViewSet,
    TeamMemberAdminViewSet,
    CommentAdminViewSet,
    TechnologyAdminViewSet,
    ProjectAdminViewSet,
    ResearchAdminViewSet,
    ResultAdminViewSet,
)
from content.views.applications import ApplicationAdminViewSet
from content.views.articles_admin import ArticleAdminViewSet

# Создаем роутер для admin API
router = DefaultRouter()

# Регистрируем все ViewSets
router.register(r'news', NewsAdminViewSet, basename='admin-news')
router.register(r'grants', GrantAdminViewSet, basename='admin-grants')
router.register(r'scholarships', ScholarshipAdminViewSet, basename='admin-scholarships')
router.register(r'competitions', CompetitionAdminViewSet, basename='admin-competitions')
router.register(r'innovations', InnovationAdminViewSet, basename='admin-innovations')
router.register(r'internships', InternshipAdminViewSet, basename='admin-internships')
router.register(r'jobs', JobAdminViewSet, basename='admin-jobs')
router.register(r'team', TeamMemberAdminViewSet, basename='admin-team')
router.register(r'applications', ApplicationAdminViewSet, basename='admin-applications')
router.register(r'articles', ArticleAdminViewSet, basename='admin-articles')
router.register(r'comments', CommentAdminViewSet, basename='admin-comments')
router.register(r'technologies', TechnologyAdminViewSet, basename='admin-technologies')
router.register(r'projects', ProjectAdminViewSet, basename='admin-projects')
router.register(r'research', ResearchAdminViewSet, basename='admin-research')
router.register(r'results', ResultAdminViewSet, basename='admin-results')

urlpatterns = router.urls

