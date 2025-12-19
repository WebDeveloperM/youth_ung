from django.urls import path
from content.views.innovations_public import InnovationListView, InnovationDetailView

urlpatterns = [
    path('', InnovationListView.as_view(), name='innovation-list'),
    path('<int:id>/', InnovationDetailView.as_view(), name='innovation-detail'),
]


