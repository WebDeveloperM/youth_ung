"""
Views для публичного API результатов (для frontend)
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import F
from content.models import Result
from content.serializers.results_public import ResultListSerializer, ResultDetailSerializer


class ResultListView(generics.ListAPIView):
    """Список опубликованных результатов"""
    serializer_class = ResultListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Возвращает только опубликованные результаты, отсортированные по году"""
        queryset = Result.objects.filter(is_published=True).order_by('-year', '-created_at')
        
        # Фильтр по категории
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Фильтр по статусу
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Фильтр по году
        year = self.request.query_params.get('year', None)
        if year:
            try:
                queryset = queryset.filter(year=int(year))
            except (ValueError, TypeError):
                pass
        
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


class ResultDetailView(generics.RetrieveAPIView):
    """Детальный результат с увеличением счетчика просмотров"""
    serializer_class = ResultDetailSerializer
    permission_classes = [AllowAny]
    queryset = Result.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Получение результата с увеличением просмотров"""
        instance = self.get_object()
        
        # Увеличиваем счетчик просмотров
        Result.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        # Обновляем instance чтобы вернуть актуальное значение
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ResultIncrementLikeView(APIView):
    """Увеличение лайков результата"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        """Увеличивает счетчик лайков"""
        try:
            result = Result.objects.get(pk=pk, is_published=True)
            result.likes = F('likes') + 1
            result.save(update_fields=['likes'])
            result.refresh_from_db()
            
            return Response({
                'success': True,
                'likes': result.likes,
            })
        except Result.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Результат не найден'
            }, status=status.HTTP_404_NOT_FOUND)

