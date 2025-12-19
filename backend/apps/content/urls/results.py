"""
URL patterns для публичного API результатов (для frontend)
"""
from django.urls import path
from content.views.results_public import (
    ResultListView,
    ResultDetailView,
    ResultIncrementLikeView,
)

urlpatterns = [
    path('', ResultListView.as_view(), name='results-list'),
    path('<int:pk>/', ResultDetailView.as_view(), name='result-detail'),
    path('<int:pk>/like/', ResultIncrementLikeView.as_view(), name='result-like'),
]

