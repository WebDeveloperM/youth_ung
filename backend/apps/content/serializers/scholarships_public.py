"""
Публичные сериализаторы для стипендий
"""
from rest_framework import serializers
from content.models import Scholarship


class ScholarshipListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка стипендий (публичный API)"""
    
    class Meta:
        model = Scholarship
        fields = [
            'id',
            'title_uz',
            'title_ru',
            'title_en',
            'short_description_uz',
            'short_description_ru',
            'short_description_en',
            'image',
            'amount',
            'duration',
            'deadline',
            'status',
            'category',
            'recipients',
            'created_at',
        ]


class ScholarshipDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной стипендии (публичный API)"""
    
    class Meta:
        model = Scholarship
        fields = [
            'id',
            'title_uz',
            'title_ru',
            'title_en',
            'short_description_uz',
            'short_description_ru',
            'short_description_en',
            'content_uz',
            'content_ru',
            'content_en',
            'image',
            'amount',
            'duration',
            'deadline',
            'status',
            'category',
            'recipients',
            'created_at',
            'updated_at',
        ]

