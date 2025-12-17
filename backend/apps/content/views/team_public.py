from rest_framework import generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from content.models import TeamMember
from content.serializers.team_public import TeamMemberPublicSerializer


class TeamMemberListView(generics.ListAPIView):
    """Публичный API для списка членов команды"""
    queryset = TeamMember.objects.filter(is_active=True).order_by('order', 'name_ru')
    serializer_class = TeamMemberPublicSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name_uz', 'name_ru', 'name_en', 'position_uz', 'position_ru', 'position_en']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', 'name_ru']


class TeamMemberDetailView(generics.RetrieveAPIView):
    """Публичный API для детальной информации о члене команды"""
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

