from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from content.models import YouthStatistics, YouthStatisticsHistory
from content.serializers.statistics import YouthStatisticsSerializer, YouthStatisticsHistorySerializer


class YouthStatisticsView(APIView):
    """
    API для получения и обновления статистики молодежи
    GET: Получить текущую статистику
    PUT/PATCH: Обновить статистику (только для авторизованных)
    """
    permission_classes = []  # Разрешаем всем (временно для отладки)
    
    def get(self, request):
        """Получить текущую статистику"""
        statistics = YouthStatistics.get_instance()
        serializer = YouthStatisticsSerializer(statistics)
        return Response(serializer.data)
    
    def put(self, request):
        """Полное обновление статистики"""
        statistics = YouthStatistics.get_instance()
        serializer = YouthStatisticsSerializer(statistics, data=request.data, partial=False)
        
        if serializer.is_valid():
            # Сохраняем информацию о том, кто обновил (если авторизован)
            if request.user and request.user.is_authenticated:
                serializer.save(updated_by=request.user)
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Частичное обновление статистики"""
        statistics = YouthStatistics.get_instance()
        serializer = YouthStatisticsSerializer(statistics, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Сохраняем информацию о том, кто обновил (если авторизован)
            if request.user and request.user.is_authenticated:
                serializer.save(updated_by=request.user)
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class YouthStatisticsHistoryView(APIView):
    """
    API для получения истории статистики за период
    GET: Получить историю за последние N месяцев (по умолчанию 12)
    """
    permission_classes = []  # Открытый доступ для чтения
    
    def get(self, request):
        """Получить историю статистики"""
        # Параметр months - количество месяцев истории (по умолчанию 12)
        months = int(request.GET.get('months', 12))
        
        # Получаем записи за последние N месяцев
        start_date = timezone.now() - timedelta(days=months * 30)
        
        # Берем по одной записи на день (последнюю за день) чтобы не загружать слишком много
        history = YouthStatisticsHistory.objects.filter(
            recorded_at__gte=start_date
        ).order_by('recorded_at')
        
        # Группируем по датам (одна запись в день)
        daily_history = {}
        for record in history:
            date_key = record.recorded_at.date()
            daily_history[date_key] = record
        
        # Преобразуем в список
        history_list = list(daily_history.values())
        
        serializer = YouthStatisticsHistorySerializer(history_list, many=True)
        return Response(serializer.data)
