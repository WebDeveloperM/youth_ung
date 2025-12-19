from rest_framework import serializers
from content.models import YouthStatistics, YouthStatisticsHistory


class YouthStatisticsSerializer(serializers.ModelSerializer):
    """Сериализатор для статистики молодежи"""
    
    updated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = YouthStatistics
        fields = [
            'id',
            'total_youth',
            'male_count',
            'female_count',
            'foreign_graduates',
            'top300_graduates',
            'top500_graduates',
            'higher_education',
            'secondary_education',
            'technical_staff',
            'service_staff',
            'promoted_youth',
            'language_cert_total',
            'ielts_count',
            'cefr_count',
            'topik_count',
            'scientific_degree_total',
            'phd_count',
            'dsc_count',
            'candidate_count',
            'young_leaders_total',
            'directors_count',
            'heads_count',
            'managers_count',
            'state_awards_total',
            'orders_count',
            'medals_count',
            'honorary_count',
            'last_updated',
            'updated_by',
            'updated_by_name',
        ]
        read_only_fields = ['id', 'last_updated', 'updated_by', 'updated_by_name']
    
    def get_updated_by_name(self, obj):
        """Получить имя пользователя, который последним обновлял"""
        if obj.updated_by:
            return f"{obj.updated_by.first_name} {obj.updated_by.last_name}".strip() or obj.updated_by.username
        return None


class YouthStatisticsHistorySerializer(serializers.ModelSerializer):
    """Сериализатор для истории статистики"""
    
    date = serializers.DateTimeField(source='recorded_at', format='%Y-%m-%d')
    
    class Meta:
        model = YouthStatisticsHistory
        fields = [
            'id',
            'date',
            'total_youth',
            'male_count',
            'female_count',
            'foreign_graduates',
            'top300_graduates',
            'top500_graduates',
            'higher_education',
            'secondary_education',
            'technical_staff',
            'service_staff',
            'promoted_youth',
            'language_cert_total',
            'scientific_degree_total',
            'young_leaders_total',
            'state_awards_total',
        ]

