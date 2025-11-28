from django.urls import path
from content.views.competitions_public import CompetitionListView, CompetitionDetailView

urlpatterns = [
    path('', CompetitionListView.as_view(), name='competition-list'),
    path('<int:id>/', CompetitionDetailView.as_view(), name='competition-detail'),
]

