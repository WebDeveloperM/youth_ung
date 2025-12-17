from django.urls import path
from content.views.jobs_public import JobListView, JobDetailView

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),
    path('<int:id>/', JobDetailView.as_view(), name='job-detail'),
]

