from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, F

from content.models import Article
from content.serializers.articles_public import (
    ArticleListSerializer,
    ArticleDetailSerializer,
    ArticleSubmitSerializer,
    MyArticleSerializer
)


class ArticlePublicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Foydalanuvchilar uchun tasdiqlangan maqolalarni ko'rish
    """
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title_uz', 'title_ru', 'title_en', 'abstract_uz', 'abstract_ru', 'abstract_en', 'keywords_uz', 'keywords_ru', 'keywords_en']
    ordering_fields = ['created_at', 'views', 'downloads', 'likes', 'publication_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Faqat tasdiqlangan va nashr qilingan maqolalarni qaytarish"""
        queryset = Article.objects.filter(status='approved', is_published=True)
        
        # Kategoriya bo'yicha filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Tanlangan maqolalar
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Qidiruv
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title_uz__icontains=search) |
                Q(title_ru__icontains=search) |
                Q(title_en__icontains=search) |
                Q(abstract_uz__icontains=search) |
                Q(abstract_ru__icontains=search) |
                Q(abstract_en__icontains=search)
            )
        
        return queryset.select_related('author')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Maqolani ko'rish va ko'rishlar sonini oshirish"""
        instance = self.get_object()
        instance.views = F('views') + 1
        instance.save(update_fields=['views'])
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Maqolaga like qo'yish"""
        article = self.get_object()
        article.likes = F('likes') + 1
        article.save(update_fields=['likes'])
        article.refresh_from_db()
        return Response({'likes': article.likes})
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """PDF yuklab olish va downloads sonini oshirish"""
        article = self.get_object()
        if not article.pdf_file:
            return Response({'error': 'PDF fayl mavjud emas'}, status=status.HTTP_404_NOT_FOUND)
        
        article.downloads = F('downloads') + 1
        article.save(update_fields=['downloads'])
        article.refresh_from_db()
        
        return Response({
            'file_url': article.pdf_file.url,
            'downloads': article.downloads
        })


class ArticleSubmitViewSet(viewsets.ModelViewSet):
    """
    Foydalanuvchilar uchun maqola yuborish va o'z maqolalarini ko'rish
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Faqat o'z maqolalarini ko'rish"""
        return Article.objects.filter(author=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return MyArticleSerializer
        return ArticleSubmitSerializer
    
    def perform_create(self, serializer):
        """Yangi maqola yaratish"""
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        """Faqat pending holatdagi maqolalarni tahrirlash mumkin"""
        instance = self.get_object()
        if instance.status != 'pending':
            return Response(
                {'error': 'Faqat kutilayotgan maqolalarni tahrirlash mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """Faqat pending yoki rejected holatdagi maqolalarni o'chirish mumkin"""
        if instance.status not in ['pending', 'rejected']:
            return Response(
                {'error': 'Faqat kutilayotgan yoki rad etilgan maqolalarni o\'chirish mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Foydalanuvchining maqolalar statistikasi"""
        user_articles = self.get_queryset()
        stats = {
            'total': user_articles.count(),
            'pending': user_articles.filter(status='pending').count(),
            'approved': user_articles.filter(status='approved').count(),
            'rejected': user_articles.filter(status='rejected').count(),
            'revision': user_articles.filter(status='revision').count(),
            'published': user_articles.filter(is_published=True).count(),
        }
        return Response(stats)

