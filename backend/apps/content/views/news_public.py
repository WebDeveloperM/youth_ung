"""
Views для публичного API новостей (для frontend)
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import F
from content.models import News
from content.serializers.news_public import NewsListSerializer, NewsDetailSerializer


class NewsListView(generics.ListAPIView):
    """Список опубликованных новостей"""
    serializer_class = NewsListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Возвращает только опубликованные новости, отсортированные по дате"""
        queryset = News.objects.filter(is_published=True).order_by('-date', '-created_at')
        
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


class NewsDetailView(generics.RetrieveAPIView):
    """Детальная новость с увеличением счетчика просмотров"""
    serializer_class = NewsDetailSerializer
    permission_classes = [AllowAny]
    queryset = News.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Получение новости с увеличением просмотров"""
        instance = self.get_object()
        
        # Увеличиваем счетчик просмотров
        News.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        # Обновляем instance чтобы вернуть актуальное значение
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NewsIncrementLikeView(APIView):
    """Увеличение лайков новости"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        """Увеличивает счетчик лайков"""
        try:
            news = News.objects.get(pk=pk, is_published=True)
            news.likes = F('likes') + 1
            news.save(update_fields=['likes'])
            news.refresh_from_db()
            
            return Response({
                'success': True,
                'likes': news.likes,
            })
        except News.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Новость не найдена'
            }, status=status.HTTP_404_NOT_FOUND)

