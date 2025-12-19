from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.all_users import AllUsersViewSet

router = DefaultRouter()
router.register('', AllUsersViewSet, basename='all-users')

urlpatterns = [
    path('', include(router.urls)),
]

