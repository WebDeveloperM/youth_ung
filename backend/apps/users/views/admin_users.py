from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from users.models import User
from users.serializers.admin_serializer import (
    AdminUserListSerializer,
    AdminUserCreateSerializer,
    AdminUserUpdateSerializer,
    AdminUserDetailSerializer
)
from users.utils.authentication import CustomTokenAuthentication


class IsAdminOrModeratorOrCoordinator(IsAuthenticated):
    """Проверка что пользователь Admin, Moderator или Coordinator"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['Admin', 'Moderator', 'Coordinator']


# Алиас для обратной совместимости
IsAdminOrModerator = IsAdminOrModeratorOrCoordinator


class AdminUserViewSet(viewsets.ModelViewSet):
    """ViewSet для управления администраторами"""
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModeratorOrCoordinator]
    
    def get_queryset(self):
        """Возвращаем администраторов, модераторов и координаторов"""
        return User.objects.filter(
            Q(role=User.ADMIN) | Q(role=User.MODERATOR) | Q(role=User.COORDINATOR)
        ).select_related('organization').order_by('-date_joined')
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'create':
            return AdminUserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AdminUserUpdateSerializer
        elif self.action == 'retrieve':
            return AdminUserDetailSerializer
        return AdminUserListSerializer
    
    def create(self, request, *args, **kwargs):
        """Создание нового администратора"""
        # Проверка что только Admin может создавать других админов
        if request.user.role != User.ADMIN:
            return Response(
                {'error': 'Только главный администратор может создавать новых администраторов'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """Обновление администратора"""
        # Проверка что только Admin может редактировать других админов
        if request.user.role != User.ADMIN and request.user.id != int(kwargs.get('pk', 0)):
            return Response(
                {'error': 'Вы можете редактировать только свой профиль'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Удаление администратора (деактивация)"""
        # Проверка что только Admin может удалять админов
        if request.user.role != User.ADMIN:
            return Response(
                {'error': 'Только главный администратор может удалять администраторов'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        
        # Нельзя удалить самого себя
        if instance.id == request.user.id:
            return Response(
                {'error': 'Вы не можете удалить самого себя'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Деактивируем пользователя вместо удаления
        instance.is_active = False
        instance.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def menu_options(self, request):
        """Получить список всех доступных меню для настройки прав"""
        menus = [
            {'key': 'dashboard', 'label': 'Панель управления'},
            {'key': 'news', 'label': 'Новости'},
            {'key': 'grants', 'label': 'Гранты'},
            {'key': 'scholarships', 'label': 'Стипендии'},
            {'key': 'competitions', 'label': 'Конкурсы'},
            {'key': 'innovations', 'label': 'Инновации'},
            {'key': 'internships', 'label': 'Стажировки'},
            {'key': 'jobs', 'label': 'Вакансии'},
            {'key': 'team', 'label': 'Команда'},
            {'key': 'comments', 'label': 'Комментарии'},
            {'key': 'applications', 'label': 'Заявки'},
            {'key': 'analytics', 'label': 'Аналитика'},
            {'key': 'admins', 'label': 'Администраторы'},
        ]
        return Response(menus)


