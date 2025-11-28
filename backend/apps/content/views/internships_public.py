from rest_framework import generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from content.models import Internship
from content.serializers.internships_public import InternshipListSerializer, InternshipDetailSerializer


class InternshipListView(generics.ListAPIView):
    """Публичный API для списка стажировок"""
    queryset = Internship.objects.all()
    serializer_class = InternshipListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'short_description_ru', 'short_description_en']
    ordering_fields = ['deadline', 'start_date', 'created_at', 'applicants']
    ordering = ['-deadline']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по статусу (если передан)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Фильтр по категории (если передан)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Лимит (для главной страницы)
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        return queryset


class InternshipDetailView(generics.RetrieveAPIView):
    """Публичный API для детальной информации о стажировке"""
    queryset = Internship.objects.all()
    serializer_class = InternshipDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

