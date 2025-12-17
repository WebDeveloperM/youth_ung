from django.urls import path
from content.views.team_public import TeamMemberListView, TeamMemberDetailView

urlpatterns = [
    path('', TeamMemberListView.as_view(), name='team-list'),
    path('<int:id>/', TeamMemberDetailView.as_view(), name='team-detail'),
]

