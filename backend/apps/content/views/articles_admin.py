from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Q, Count
from django.utils import timezone

from content.models import Article
from content.serializers.articles_admin import (
    ArticleAdminListSerializer,
    ArticleAdminDetailSerializer,
    ArticleApprovalSerializer
)
from users.views.admin_users import IsAdminOrModerator
from users.utils.authentication import CustomTokenAuthentication


class ArticleAdminViewSet(viewsets.ModelViewSet):
    """
    Admin panel uchun maqolalarni boshqarish
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title_uz', 'title_ru', 'title_en', 'author__email', 'author__username']
    ordering_fields = ['created_at', 'updated_at', 'status', 'views', 'downloads']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Barcha maqolalarni qaytarish"""
        queryset = Article.objects.all().select_related('author', 'approved_by')
        
        # Status bo'yicha filter
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Kategoriya bo'yicha filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Nashr qilinganlik bo'yicha filter
        is_published = self.request.query_params.get('is_published', None)
        if is_published is not None:
            queryset = queryset.filter(is_published=is_published.lower() == 'true')
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleAdminDetailSerializer
        elif self.action in ['approve', 'reject', 'request_revision']:
            return ArticleApprovalSerializer
        return ArticleAdminListSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Maqolani tasdiqlash"""
        article = self.get_object()
        serializer = ArticleApprovalSerializer(
            article,
            data={
                'status': 'approved',
                'admin_comment': request.data.get('admin_comment', ''),
                'is_published': request.data.get('is_published', True),
                'is_featured': request.data.get('is_featured', False)
            },
            context={'request': request},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Maqola tasdiqlandi',
                'article': ArticleAdminDetailSerializer(article).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Maqolani rad etish"""
        article = self.get_object()
        admin_comment = request.data.get('admin_comment', '')
        
        if not admin_comment:
            return Response(
                {'error': 'Rad etish uchun izoh talab qilinadi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ArticleApprovalSerializer(
            article,
            data={
                'status': 'rejected',
                'admin_comment': admin_comment,
                'is_published': False
            },
            context={'request': request},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Maqola rad etildi',
                'article': ArticleAdminDetailSerializer(article).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def request_revision(self, request, pk=None):
        """Qayta ko'rib chiqishni so'rash"""
        article = self.get_object()
        admin_comment = request.data.get('admin_comment', '')
        
        if not admin_comment:
            return Response(
                {'error': 'Qayta ko\'rib chiqish uchun izoh talab qilinadi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ArticleApprovalSerializer(
            article,
            data={
                'status': 'revision',
                'admin_comment': admin_comment,
                'is_published': False
            },
            context={'request': request},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Qayta ko\'rib chiqish so\'raldi',
                'article': ArticleAdminDetailSerializer(article).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Maqolalar statistikasi"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'by_status': {
                'pending': queryset.filter(status='pending').count(),
                'approved': queryset.filter(status='approved').count(),
                'rejected': queryset.filter(status='rejected').count(),
                'revision': queryset.filter(status='revision').count(),
            },
            'by_category': {},
            'published': queryset.filter(is_published=True).count(),
            'featured': queryset.filter(is_featured=True).count(),
            'total_views': sum(queryset.values_list('views', flat=True)),
            'total_downloads': sum(queryset.values_list('downloads', flat=True)),
        }
        
        # Kategoriya bo'yicha statistika
        for category in Article.CATEGORY_CHOICES:
            stats['by_category'][category[0]] = queryset.filter(category=category[0]).count()
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def pending_count(self, request):
        """Kutilayotgan maqolalar soni"""
        count = self.get_queryset().filter(status='pending').count()
        return Response({'pending_count': count})

