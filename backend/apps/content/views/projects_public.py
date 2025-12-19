"""
Views для публичного API проектов (для frontend)
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import F
from content.models import Project
from content.serializers.projects_public import ProjectListSerializer, ProjectDetailSerializer


class ProjectListView(generics.ListAPIView):
    """Список опубликованных проектов"""
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Возвращает только опубликованные проекты, отсортированные по дате"""
        queryset = Project.objects.filter(is_published=True).order_by('-start_date', '-created_at')
        
        # Фильтр по категории
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Фильтр по статусу
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
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


class ProjectDetailView(generics.RetrieveAPIView):
    """Детальный проект с увеличением счетчика просмотров"""
    serializer_class = ProjectDetailSerializer
    permission_classes = [AllowAny]
    queryset = Project.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Получение проекта с увеличением просмотров"""
        instance = self.get_object()
        
        # Увеличиваем счетчик просмотров
        Project.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        # Обновляем instance чтобы вернуть актуальное значение
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ProjectIncrementLikeView(APIView):
    """Увеличение лайков проекта"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        """Увеличивает счетчик лайков"""
        try:
            project = Project.objects.get(pk=pk, is_published=True)
            project.likes = F('likes') + 1
            project.save(update_fields=['likes'])
            project.refresh_from_db()
            
            return Response({
                'success': True,
                'likes': project.likes,
            })
        except Project.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Проект не найден'
            }, status=status.HTTP_404_NOT_FOUND)

