"""
Views для публичного API технологий (для frontend)
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import F
from content.models import Technology
from content.serializers.technologies_public import TechnologyListSerializer, TechnologyDetailSerializer


class TechnologyListView(generics.ListAPIView):
    """Список опубликованных технологий"""
    serializer_class = TechnologyListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Возвращает только опубликованные технологии, отсортированные по дате"""
        queryset = Technology.objects.filter(is_published=True).order_by('-date', '-created_at')
        
        # Фильтр по категории
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Фильтр по избранным
        is_featured = self.request.query_params.get('is_featured', None)
        if is_featured is not None:
            queryset = queryset.filter(is_featured=True)
        
        # Лимит (для главной страницы)
        limit = self.request.query_params.get('limit', None)
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass
        
        return queryset


class TechnologyDetailView(generics.RetrieveAPIView):
    """Детальная технология с увеличением счетчика просмотров"""
    serializer_class = TechnologyDetailSerializer
    permission_classes = [AllowAny]
    queryset = Technology.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Получение технологии с увеличением просмотров"""
        instance = self.get_object()
        
        # Увеличиваем счетчик просмотров
        Technology.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        # Обновляем instance чтобы вернуть актуальное значение
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class TechnologyIncrementLikeView(APIView):
    """Увеличение лайков технологии"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        """Увеличивает счетчик лайков"""
        try:
            technology = Technology.objects.get(pk=pk, is_published=True)
            technology.likes = F('likes') + 1
            technology.save(update_fields=['likes'])
            technology.refresh_from_db()
            
            return Response({
                'success': True,
                'likes': technology.likes,
            })
        except Technology.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Технология не найдена'
            }, status=status.HTTP_404_NOT_FOUND)

