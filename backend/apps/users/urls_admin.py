from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.admin_users import AdminUserViewSet

router = DefaultRouter()
router.register('', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),
]


