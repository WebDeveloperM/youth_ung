from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from content.models import Appeal
from content.serializers.appeals import (
    AppealCreateSerializer,
    AppealListSerializer,
    AppealDetailSerializer,
    AppealUpdateSerializer
)


class AppealViewSet(viewsets.ModelViewSet):
    """
    API для работы с обращениями
    - Создание: только для авторизованных пользователей
    - Просмотр списка/детал просмотра/обновление: только для админов
    """
    queryset = Appeal.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'is_anonymous', 'user']
    search_fields = ['subject', 'message', 'user__username', 'user__email']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Разные права для разных действий"""
        if self.action == 'create':
            # Создание доступно авторизованным
            return [IsAuthenticated()]
        else:
            # Просмотр и изменение только админам
            return [IsAuthenticated(), IsAdminUser()]
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'create':
            return AppealCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppealUpdateSerializer
        elif self.action == 'retrieve':
            return AppealDetailSerializer
        return AppealListSerializer
    
    def create(self, request, *args, **kwargs):
        """Создание нового обращения"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Обращение успешно отправлено',
                'id': serializer.instance.id if serializer.instance else None
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Изменить статус обращения"""
        appeal = self.get_object()
        new_status = request.data.get('status')
        admin_response = request.data.get('admin_response', '')
        
        if new_status not in dict(Appeal.STATUS_CHOICES):
            return Response(
                {'error': 'Недопустимый статус'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AppealUpdateSerializer(
            appeal,
            data={'status': new_status, 'admin_response': admin_response},
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(AppealDetailSerializer(appeal).data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Статистика по обращениям"""
        total = Appeal.objects.count()
        new = Appeal.objects.filter(status='new').count()
        in_progress = Appeal.objects.filter(status='in_progress').count()
        resolved = Appeal.objects.filter(status='resolved').count()
        rejected = Appeal.objects.filter(status='rejected').count()
        
        return Response({
            'total': total,
            'new': new,
            'in_progress': in_progress,
            'resolved': resolved,
            'rejected': rejected,
        })

