from django.urls import path, include
from rest_framework.routers import DefaultRouter
from organisation.views import OrganisationAdminViewSet, OrganisationPublicViewSet

# Роутер для админ-панели
admin_router = DefaultRouter()
admin_router.register('organisations', OrganisationAdminViewSet, basename='admin-organisations')

# Роутер для публичного API
public_router = DefaultRouter()
public_router.register('organisations', OrganisationPublicViewSet, basename='public-organisations')

urlpatterns = [
    # Админ роуты
    path('admin/', include(admin_router.urls)),
    # Публичные роуты
    path('public/', include(public_router.urls)),
]


