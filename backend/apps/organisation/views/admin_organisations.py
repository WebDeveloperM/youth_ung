from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError

from organisation.models import Organisation
from organisation.serializers import (
    OrganisationSerializer,
    OrganisationListSerializer,
    OrganisationDetailSerializer,
)


class OrganisationAdminViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления организациями в админ-панели
    """
    queryset = Organisation.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'email', 'phone', 'address']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'list':
            return OrganisationListSerializer
        elif self.action == 'retrieve':
            return OrganisationDetailSerializer
        return OrganisationSerializer
    
    def destroy(self, request, *args, **kwargs):
        """Удаление организации с проверкой"""
        from users.models import User
        
        instance = self.get_object()
        employees_count = User.objects.filter(organization=instance).count()
        
        if employees_count > 0:
            raise ValidationError({
                'detail': f'Невозможно удалить организацию "{instance.name}". '
                         f'У неё есть {employees_count} сотрудник(ов). '
                         f'Сначала переместите или удалите пользователей.'
            })
        
        self.perform_destroy(instance)
        return Response(
            {'message': f'Организация "{instance.name}" успешно удалена.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Получить статистику по организациям"""
        from users.models import User
        
        total_organisations = Organisation.objects.count()
        organisations_with_employees = Organisation.objects.filter(
            id__in=User.objects.values_list('organization_id', flat=True).distinct()
        ).count()
        total_employees = User.objects.count()
        
        data = {
            'total_organisations': total_organisations,
            'organisations_with_employees': organisations_with_employees,
            'organisations_without_employees': total_organisations - organisations_with_employees,
            'total_employees': total_employees,
        }
        return Response(data)

