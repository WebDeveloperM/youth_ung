"""
URL patterns для публичного API грантов (для frontend)
"""
from django.urls import path
from content.views.grants_public import (
    GrantListView,
    GrantDetailView,
)

urlpatterns = [
    path('', GrantListView.as_view(), name='grant-list'),
    path('<int:pk>/', GrantDetailView.as_view(), name='grant-detail'),
]

