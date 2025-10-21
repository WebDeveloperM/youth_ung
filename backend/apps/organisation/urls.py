from django.urls import path
from

from backend.apps.organisation.views.organisation import GetOrganisationInfoView

urlpatterns = [
    path('get-organisation-info', GetOrganisationInfoView, name='get-organisation-info'),

]
