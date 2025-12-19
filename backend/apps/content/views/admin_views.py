from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from content.models import (
    News, Grant, Scholarship, Competition, 
    Innovation, Internship, Job, TeamMember,
    Technology, Project, Research, Result,
)
from content.models_comments import Comment
from content.serializers.admin_news import NewsAdminSerializer, NewsListAdminSerializer
from content.serializers.admin_content import (
    GrantAdminSerializer, ScholarshipAdminSerializer, CompetitionAdminSerializer,
    InnovationAdminSerializer, InternshipAdminSerializer, JobAdminSerializer,
    TeamMemberAdminSerializer, TechnologyAdminSerializer, ProjectAdminSerializer,
    ResearchAdminSerializer, ResultAdminSerializer,
)
from content.serializers.comments import CommentSerializer
from users.utils.authentication import CustomTokenAuthentication


class IsAdminOrModerator(IsAuthenticated):
    """Проверка что пользователь Admin, Moderator или Coordinator"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['Admin', 'Moderator', 'Coordinator']


class NewsAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления новостями в админке"""
    
    queryset = News.objects.all().order_by('-date')
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_published', 'is_featured']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'content_uz', 'content_ru', 'content_en']
    ordering_fields = ['date', 'created_at', 'views', 'likes']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListAdminSerializer
        return NewsAdminSerializer
    
    def create(self, request, *args, **kwargs):
        # ОТЛАДКА: Логируем что пришло ДО валидации
        import logging
        logger = logging.getLogger(__name__)
        logger.error('=' * 80)
        logger.error('📥 VIEWSET CREATE - REQUEST DATA:')
        logger.error(f'  Content-Type: {request.content_type}')
        for key, value in request.data.items():
            logger.error(f'  📦 {key}: {type(value).__name__} = {str(value)[:100]}')
        logger.error('=' * 80)
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Массовое удаление"""
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'IDs not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count = News.objects.filter(id__in=ids).delete()[0]
        return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def bulk_publish(self, request):
        """Массовая публикация"""
        ids = request.data.get('ids', [])
        is_published = request.data.get('is_published', True)
        
        if not ids:
            return Response({'error': 'IDs not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        updated_count = News.objects.filter(id__in=ids).update(is_published=is_published)
        return Response({'updated': updated_count}, status=status.HTTP_200_OK)


class GrantAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления грантами"""
    
    queryset = Grant.objects.all().order_by('-deadline')
    serializer_class = GrantAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['deadline', 'created_at', 'applicants']


class ScholarshipAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления стипендиями"""
    
    queryset = Scholarship.objects.all().order_by('-deadline')
    serializer_class = ScholarshipAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['deadline', 'created_at', 'recipients']


class CompetitionAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления конкурсами"""
    
    queryset = Competition.objects.all().order_by('-start_date')
    serializer_class = CompetitionAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['start_date', 'created_at', 'participants']


class InnovationAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления инновациями"""
    
    queryset = Innovation.objects.all().order_by('-date')
    serializer_class = InnovationAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['date', 'created_at', 'views', 'likes']


class InternshipAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления стажировками"""
    
    queryset = Internship.objects.all().order_by('-deadline')
    serializer_class = InternshipAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en']
    ordering_fields = ['deadline', 'created_at', 'applicants']


class JobAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления вакансиями"""
    
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'employment_type']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'location']
    ordering_fields = ['deadline', 'created_at', 'applicants']


class TeamMemberAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления командой"""
    
    queryset = TeamMember.objects.all().order_by('order', 'name_ru')
    serializer_class = TeamMemberAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'category']
    search_fields = ['name_uz', 'name_ru', 'name_en', 'position_uz', 'position_ru', 'position_en']
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Изменить порядок отображения"""
        orders = request.data.get('orders', {})  # {id: order}
        
        for member_id, order in orders.items():
            TeamMember.objects.filter(id=member_id).update(order=order)
        
        return Response({'success': True}, status=status.HTTP_200_OK)


class CommentAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления комментариями в админке"""
    
    queryset = Comment.objects.all().select_related('author').order_by('-created_at')
    serializer_class = CommentSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_moderated', 'is_deleted', 'content_type']
    search_fields = ['content', 'author__username', 'author__email']
    ordering_fields = ['created_at', 'likes', 'dislikes']
    
    def get_queryset(self):
        """Фильтрация комментариев"""
        queryset = super().get_queryset()
        
        # Фильтр по автору
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        
        # Фильтр по датам
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        """Модерация комментария"""
        comment = self.get_object()
        is_moderated = request.data.get('is_moderated', True)
        
        comment.is_moderated = is_moderated
        comment.save(update_fields=['is_moderated'])
        
        return Response({
            'message': 'Комментарий модерирован' if is_moderated else 'Модерация отменена',
            'is_moderated': comment.is_moderated
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def bulk_moderate(self, request):
        """Массовая модерация"""
        ids = request.data.get('ids', [])
        is_moderated = request.data.get('is_moderated', True)
        
        if not ids:
            return Response({'error': 'IDs not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        updated_count = Comment.objects.filter(id__in=ids).update(is_moderated=is_moderated)
        return Response({
            'updated': updated_count,
            'message': f'Модерировано: {updated_count}'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Массовое удаление"""
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'IDs not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Мягкое удаление
        updated_count = Comment.objects.filter(id__in=ids).update(is_deleted=True)
        return Response({
            'deleted': updated_count,
            'message': f'Удалено: {updated_count}'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Статистика по комментариям"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total': queryset.count(),
            'moderated': queryset.filter(is_moderated=True, is_deleted=False).count(),
            'pending': queryset.filter(is_moderated=False, is_deleted=False).count(),
            'deleted': queryset.filter(is_deleted=True).count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)


class TechnologyAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления технологиями"""
    
    queryset = Technology.objects.all().order_by('-date')
    serializer_class = TechnologyAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_published', 'is_featured', 'category']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'short_description_ru']


class ProjectAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления проектами"""
    
    queryset = Project.objects.all().order_by('-start_date')
    serializer_class = ProjectAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_published', 'is_featured', 'category', 'status']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'short_description_ru']


class ResearchAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления исследованиями"""
    
    queryset = Research.objects.all().order_by('-start_date')
    serializer_class = ResearchAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_published', 'is_featured', 'category', 'status']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'authors', 'department']


class ResultAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления результатами"""
    
    queryset = Result.objects.all().order_by('-year', '-created_at')
    serializer_class = ResultAdminSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_published', 'is_featured', 'category', 'status', 'year']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz']

