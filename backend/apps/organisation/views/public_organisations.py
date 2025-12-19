from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from organisation.models import Organisation
from organisation.serializers import OrganisationListSerializer


class OrganisationPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для публичного доступа к списку организаций (для регистрации)
    """
    queryset = Organisation.objects.all().order_by('name')
    serializer_class = OrganisationListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


