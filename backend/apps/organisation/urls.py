from django.urls import path


from organisation.views.organisation import GetOrganisationInfoView
from organisation.views.new import CategoryNewApiView, AllNewApiView

urlpatterns = [
    path('get-organisation-info', GetOrganisationInfoView.as_view(), name='getorganisationinfo'),
    path('get-category-new', CategoryNewApiView.as_view(), name='getcategorynew'),
    path('get-all-new', AllNewApiView.as_view(), name='getallnew'),

]

