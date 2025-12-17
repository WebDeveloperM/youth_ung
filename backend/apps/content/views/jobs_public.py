from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from content.models import Job
from content.serializers.jobs_public import JobPublicSerializer


class JobListView(generics.ListAPIView):
    """
    Публичный API для списка вакансий (для frontend)
    """
    queryset = Job.objects.all().select_related('created_by', 'updated_by')
    serializer_class = JobPublicSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'employment_type']
    search_fields = ['title_uz', 'title_ru', 'title_en', 'short_description_uz', 'short_description_ru', 'short_description_en']
    ordering_fields = ['created_at', 'deadline', 'applicants']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Фильтруем вакансии для публичного API
        """
        queryset = super().get_queryset()
        
        # Фильтр по статусу (если передан, иначе показываем только active)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        else:
            queryset = queryset.filter(status='active')
        
        # Лимит (для главной страницы)
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        return queryset


class JobDetailView(generics.RetrieveAPIView):
    """
    Публичный API для детальной информации о вакансии (для frontend)
    """
    queryset = Job.objects.all().select_related('created_by', 'updated_by')
    serializer_class = JobPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

