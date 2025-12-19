"""
URL patterns для публичного API технологий (для frontend)
"""
from django.urls import path
from content.views.technologies_public import (
    TechnologyListView,
    TechnologyDetailView,
    TechnologyIncrementLikeView,
)

urlpatterns = [
    path('', TechnologyListView.as_view(), name='technologies-list'),
    path('<int:pk>/', TechnologyDetailView.as_view(), name='technology-detail'),
    path('<int:pk>/like/', TechnologyIncrementLikeView.as_view(), name='technology-like'),
]

