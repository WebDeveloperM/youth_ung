from django.urls import path
from content.views.internships_public import InternshipListView, InternshipDetailView

urlpatterns = [
    path('', InternshipListView.as_view(), name='internship-list'),
    path('<int:id>/', InternshipDetailView.as_view(), name='internship-detail'),
]

