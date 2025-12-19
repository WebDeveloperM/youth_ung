"""
URL patterns для заявок
"""
from django.urls import path
from content.views.applications import ApplicationCreateView

urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='application-create'),
]


