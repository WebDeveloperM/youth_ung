from rest_framework import serializers
from content.models import Competition


class CompetitionListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка конкурсов (публичный API)"""
    
    class Meta:
        model = Competition
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'short_description_uz', 'short_description_ru', 'short_description_en',
            'image',
            'start_date', 'end_date', 'registration_deadline',
            'status',
            'category',
            'participants',
            'prize',
            'created_at',
        ]


class CompetitionDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о конкурсе (публичный API)"""
    
    class Meta:
        model = Competition
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'short_description_uz', 'short_description_ru', 'short_description_en',
            'content_uz', 'content_ru', 'content_en',
            'image',
            'start_date', 'end_date', 'registration_deadline',
            'status',
            'category',
            'participants',
            'prize',
            'created_at',
            'updated_at',
        ]


