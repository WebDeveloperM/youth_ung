"""
URL patterns для публичного API новостей (для frontend)
"""
from django.urls import path
from content.views.news_public import (
    NewsListView,
    NewsDetailView,
    NewsIncrementLikeView,
)

urlpatterns = [
    path('', NewsListView.as_view(), name='news-list'),
    path('<int:pk>/', NewsDetailView.as_view(), name='news-detail'),
    path('<int:pk>/like/', NewsIncrementLikeView.as_view(), name='news-like'),
]

