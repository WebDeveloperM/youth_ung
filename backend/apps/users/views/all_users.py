from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models

from users.models import User
from users.serializers.user import UserSerializer, UserUpdateSerializer
from users.utils.authentication import CustomTokenAuthentication


class IsAdminOrModeratorOrCoordinator(IsAuthenticated):
    """Проверка что пользователь Admin, Moderator или Coordinator"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['Admin', 'Moderator', 'Coordinator']


class AllUsersViewSet(viewsets.ModelViewSet):
    """
    ViewSet для просмотра и редактирования пользователей
    - Админы и модераторы: видят и редактируют всех пользователей
    - Координаторы: видят и редактируют ТОЛЬКО обычных пользователей (role=User) своей организации
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAdminOrModeratorOrCoordinator]
    serializer_class = UserSerializer
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    ordering_fields = ['date_joined', 'last_login', 'username']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        """
        Возвращаем пользователей в зависимости от роли:
        - Admin/Moderator: все пользователи
        - Coordinator: ТОЛЬКО обычные пользователи (role=User) своей организации
        """
        user = self.request.user
        queryset = User.objects.select_related('organization')
        
        # Координаторы видят ТОЛЬКО обычных пользователей своей организации (БЕЗ админов, модераторов и других координаторов)
        if user.role == User.COORDINATOR:
            if user.organization:
                queryset = queryset.filter(
                    organization=user.organization,
                    role=User.USER  # ТОЛЬКО обычные пользователи!
                )
            else:
                # Если у координатора нет организации, не показываем никого
                queryset = queryset.none()
        
        return queryset.order_by('-date_joined')
    
    def update(self, request, *args, **kwargs):
        """Обновление пользователя"""
        user = self.request.user
        instance = self.get_object()
        
        # Координаторы могут редактировать ТОЛЬКО пользователей своей организации
        if user.role == User.COORDINATOR:
            if not user.organization or instance.organization != user.organization:
                return Response(
                    {'error': 'Вы можете редактировать только пользователей своей организации'},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Координаторы могут редактировать ТОЛЬКО обычных пользователей
            if instance.role != User.USER:
                return Response(
                    {'error': 'Вы можете редактировать только обычных пользователей'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Частичное обновление пользователя"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Статистика по пользователям
        Для координаторов - ТОЛЬКО обычные пользователи их организации
        """
        user = request.user
        
        # Базовый queryset для статистики
        if user.role == User.COORDINATOR and user.organization:
            # Координатор видит ТОЛЬКО обычных пользователей своей организации
            base_queryset = User.objects.filter(
                organization=user.organization,
                role=User.USER
            )
        elif user.role == User.COORDINATOR and not user.organization:
            base_queryset = User.objects.none()
        else:
            # Admin/Moderator видят всех
            base_queryset = User.objects.all()
        
        total = base_queryset.count()
        active = base_queryset.filter(is_active=True).count()
        inactive = base_queryset.filter(is_active=False).count()
        
        # Для координаторов эти счетчики всегда 0 (они не видят админов)
        if user.role == User.COORDINATOR:
            admins = 0
            moderators = 0
            coordinators = 0
            users = total  # Все что они видят - это обычные пользователи
        else:
            admins = base_queryset.filter(role=User.ADMIN).count()
            moderators = base_queryset.filter(role=User.MODERATOR).count()
            coordinators = base_queryset.filter(role=User.COORDINATOR).count()
            users = base_queryset.filter(role=User.USER).count()
        
        return Response({
            'total': total,
            'active': active,
            'inactive': inactive,
            'admins': admins,
            'moderators': moderators,
            'coordinators': coordinators,
            'users': users,
        })
    
    @action(detail=False, methods=['get'])
    def detailed_statistics(self, request):
        """
        Детальная статистика по РЕАЛЬНЫМ данным пользователей
        Для координаторов - только по их организации
        """
        user = request.user
        
        # Базовый queryset для статистики
        if user.role == User.COORDINATOR and user.organization:
            # Координатор видит ТОЛЬКО обычных пользователей своей организации
            base_queryset = User.objects.filter(
                organization=user.organization,
                role=User.USER
            )
        elif user.role == User.COORDINATOR and not user.organization:
            base_queryset = User.objects.none()
        else:
            # Admin/Moderator видят всех
            base_queryset = User.objects.filter(role=User.USER)
        
        # Подсчет основной статистики
        total_users = base_queryset.count()
        male_count = base_queryset.filter(gender='Эркак').count()
        female_count = base_queryset.filter(gender='Аёл').count()
        
        # Образование
        higher_education = base_queryset.filter(education_level='higher').count()
        secondary_education = base_queryset.filter(education_level='secondary').count()
        foreign_graduates = base_queryset.filter(is_foreign_graduate=True).count()
        top300_graduates = base_queryset.filter(is_top300_graduate=True).count()
        top500_graduates = base_queryset.filter(is_top500_graduate=True).count()
        
        # Тип сотрудника
        technical_staff = base_queryset.filter(staff_type='technical').count()
        service_staff = base_queryset.filter(staff_type='service').count()
        promoted_youth = base_queryset.filter(is_promoted=True).count()
        
        # Языковые сертификаты
        ielts_count = base_queryset.filter(has_ielts=True).count()
        cefr_count = base_queryset.filter(has_cefr=True).count()
        topik_count = base_queryset.filter(has_topik=True).count()
        language_cert_total = base_queryset.filter(
            models.Q(has_ielts=True) | models.Q(has_cefr=True) | models.Q(has_topik=True)
        ).count()
        
        # Научные степени
        phd_count = base_queryset.filter(scientific_degree='phd').count()
        dsc_count = base_queryset.filter(scientific_degree='dsc').count()
        candidate_count = base_queryset.filter(scientific_degree='candidate').count()
        scientific_degree_total = phd_count + dsc_count + candidate_count
        
        # Лидерские позиции
        directors_count = base_queryset.filter(leadership_position='director').count()
        heads_count = base_queryset.filter(leadership_position='head').count()
        managers_count = base_queryset.filter(leadership_position='manager').count()
        young_leaders_total = directors_count + heads_count + managers_count
        
        # Государственные награды
        orders_count = base_queryset.filter(state_award_type='order').count()
        medals_count = base_queryset.filter(state_award_type='medal').count()
        honorary_count = base_queryset.filter(state_award_type='honorary').count()
        state_awards_total = orders_count + medals_count + honorary_count
        
        return Response({
            # Основная статистика
            'total_youth': total_users,
            'male_count': male_count,
            'female_count': female_count,
            
            # Образование
            'higher_education': higher_education,
            'secondary_education': secondary_education,
            'foreign_graduates': foreign_graduates,
            'top300_graduates': top300_graduates,
            'top500_graduates': top500_graduates,
            
            # Сотрудники
            'technical_staff': technical_staff,
            'service_staff': service_staff,
            'promoted_youth': promoted_youth,
            
            # Языковые сертификаты
            'language_cert_total': language_cert_total,
            'ielts_count': ielts_count,
            'cefr_count': cefr_count,
            'topik_count': topik_count,
            
            # Научные степени
            'scientific_degree_total': scientific_degree_total,
            'phd_count': phd_count,
            'dsc_count': dsc_count,
            'candidate_count': candidate_count,
            
            # Лидерские позиции
            'young_leaders_total': young_leaders_total,
            'directors_count': directors_count,
            'heads_count': heads_count,
            'managers_count': managers_count,
            
            # Государственные награды
            'state_awards_total': state_awards_total,
            'orders_count': orders_count,
            'medals_count': medals_count,
            'honorary_count': honorary_count,
        })

