from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from content.models import (
    News, Grant, Scholarship, Competition, 
    Innovation, Internship, Job, TeamMember
)
from content.serializers.admin_news import NewsAdminSerializer, NewsListAdminSerializer
from content.serializers.admin_content import (
    GrantAdminSerializer, ScholarshipAdminSerializer, CompetitionAdminSerializer,
    InnovationAdminSerializer, InternshipAdminSerializer, JobAdminSerializer,
    TeamMemberAdminSerializer
)
from users.utils.authentication import CustomTokenAuthentication


class IsAdminOrModerator(IsAuthenticated):
    """Проверка что пользователь Admin или Moderator"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['Admin', 'Moderator']


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
    filterset_fields = ['is_active']
    search_fields = ['name_uz', 'name_ru', 'name_en', 'position_uz', 'position_ru', 'position_en']
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Изменить порядок отображения"""
        orders = request.data.get('orders', {})  # {id: order}
        
        for member_id, order in orders.items():
            TeamMember.objects.filter(id=member_id).update(order=order)
        
        return Response({'success': True}, status=status.HTTP_200_OK)

