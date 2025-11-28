from rest_framework import generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from content.models import Innovation
from content.serializers.innovations_public import InnovationListSerializer, InnovationDetailSerializer


class InnovationListView(generics.ListAPIView):
    """Публичный API для списка инноваций"""
    queryset = Innovation.objects.all()
    serializer_class = InnovationListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['date', 'created_at', 'views', 'likes']
    ordering = ['-date']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по категории (если передан)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Фильтр по избранным (если передан)
        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        # Лимит (для главной страницы)
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        return queryset


class InnovationDetailView(generics.RetrieveAPIView):
    """Публичный API для детальной информации об инновации"""
    queryset = Innovation.objects.all()
    serializer_class = InnovationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def retrieve(self, request, *args, **kwargs):
        """Увеличиваем счетчик просмотров при получении детальной информации"""
        instance = self.get_object()
        
        # Увеличиваем views на 1
        instance.views += 1
        instance.save(update_fields=['views'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# Импорт Response для метода retrieve
from rest_framework.response import Response

