"""
URL patterns для публичного API исследований (для frontend)
"""
from django.urls import path
from content.views.research_public import (
    ResearchListView,
    ResearchDetailView,
    ResearchIncrementLikeView,
)

urlpatterns = [
    path('', ResearchListView.as_view(), name='research-list'),
    path('<int:pk>/', ResearchDetailView.as_view(), name='research-detail'),
    path('<int:pk>/like/', ResearchIncrementLikeView.as_view(), name='research-like'),
]

