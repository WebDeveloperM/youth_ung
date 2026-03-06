"""
Views для заявок
"""
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from content.models_applications import Application
from content.serializers.applications import (
    ApplicationCreateSerializer,
    ApplicationListSerializer,
    ApplicationDetailSerializer,
)
from users.utils.authentication import CustomTokenAuthentication


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST'), name='create')
class ApplicationCreateView(generics.CreateAPIView):
    """Публичный API для подачи заявки — ограничен 5 заявками в час с одного IP"""
    serializer_class = ApplicationCreateSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Создание заявки"""
        try:
            serializer = self.get_serializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            return Response({
                'success': True,
                'message': 'Заявка успешно отправлена!',
                'application_id': serializer.instance.id,
            }, status=status.HTTP_201_CREATED)
        except Ratelimited:
            return Response({
                'error': 'Слишком много заявок. Пожалуйста, подождите 1 час.',
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)


class IsAdminOrModerator(IsAuthenticated):
    """Проверка что пользователь Admin, Moderator или Coordinator"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['Admin', 'Moderator', 'Coordinator']


class ApplicationAdminViewSet(viewsets.ModelViewSet):
    """ViewSet для управления заявками в админке"""
    
    queryset = Application.objects.all().select_related(
        'user', 'reviewed_by', 'content_type'
    ).order_by('-created_at')
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModerator]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        return ApplicationDetailSerializer
    
    def update(self, request, *args, **kwargs):
        """Обновление статуса заявки"""
        instance = self.get_object()
        
        # Если меняется статус, сохраняем кто и когда рассмотрел
        if 'status' in request.data and request.data['status'] != instance.status:
            request.data['reviewed_by'] = request.user.id
            request.data['reviewed_at'] = timezone.now()
        
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Статистика по заявкам"""
        total = Application.objects.count()
        pending = Application.objects.filter(status='pending').count()
        approved = Application.objects.filter(status='approved').count()
        rejected = Application.objects.filter(status='rejected').count()
        
        return Response({
            'total': total,
            'pending': pending,
            'approved': approved,
            'rejected': rejected,
        })
    
    @action(detail=False, methods=['post'])
    def bulk_update_status(self, request):
        """Массовое изменение статуса"""
        ids = request.data.get('ids', [])
        new_status = request.data.get('status')
        
        if not ids or not new_status:
            return Response({
                'error': 'Необходимо указать ids и status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        updated_count = Application.objects.filter(id__in=ids).update(
            status=new_status,
            reviewed_by=request.user,
            reviewed_at=timezone.now(),
        )
        
        return Response({
            'updated': updated_count,
            'status': new_status,
        })


