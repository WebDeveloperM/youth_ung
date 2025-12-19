"""
URL patterns для публичного API проектов (для frontend)
"""
from django.urls import path
from content.views.projects_public import (
    ProjectListView,
    ProjectDetailView,
    ProjectIncrementLikeView,
)

urlpatterns = [
    path('', ProjectListView.as_view(), name='projects-list'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('<int:pk>/like/', ProjectIncrementLikeView.as_view(), name='project-like'),
]

