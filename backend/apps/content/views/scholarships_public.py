"""
Публичные views для стипендий
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from content.models import Scholarship
from content.serializers.scholarships_public import (
    ScholarshipListSerializer,
    ScholarshipDetailSerializer,
)


class ScholarshipListView(generics.ListAPIView):
    """Список стипендий (публичный API)"""
    serializer_class = ScholarshipListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Scholarship.objects.all().order_by('-created_at')
        
        # Фильтр по статусу
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Фильтр по категории
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Лимит результатов
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass
        
        return queryset


class ScholarshipDetailView(generics.RetrieveAPIView):
    """Детальная стипендия (публичный API)"""
    serializer_class = ScholarshipDetailSerializer
    permission_classes = [AllowAny]
    queryset = Scholarship.objects.all()

