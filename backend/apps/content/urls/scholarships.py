"""
URL patterns для публичных стипендий
"""
from django.urls import path
from content.views.scholarships_public import ScholarshipListView, ScholarshipDetailView

urlpatterns = [
    path('', ScholarshipListView.as_view(), name='scholarship-list'),
    path('<int:pk>/', ScholarshipDetailView.as_view(), name='scholarship-detail'),
]

