"""
Views для публичного API грантов (для frontend)
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny
from content.models import Grant
from content.serializers.grants_public import GrantListSerializer, GrantDetailSerializer


class GrantListView(generics.ListAPIView):
    """Список грантов"""
    serializer_class = GrantListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Возвращает гранты, отсортированные по дедлайну"""
        queryset = Grant.objects.all().order_by('deadline')
        
        # Фильтр по статусу
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Фильтр по категории
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Лимит
        limit = self.request.query_params.get('limit', None)
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass
        
        return queryset


class GrantDetailView(generics.RetrieveAPIView):
    """Детальный грант"""
    serializer_class = GrantDetailSerializer
    permission_classes = [AllowAny]
    queryset = Grant.objects.all()

