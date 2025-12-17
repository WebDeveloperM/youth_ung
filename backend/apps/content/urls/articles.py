from django.urls import path, include
from rest_framework.routers import DefaultRouter

from content.views.articles_public import ArticlePublicViewSet, ArticleSubmitViewSet

# Public API router
router = DefaultRouter()
router.register(r'', ArticlePublicViewSet, basename='article')
router.register(r'my-articles', ArticleSubmitViewSet, basename='my-article')

urlpatterns = [
    path('', include(router.urls)),
]

