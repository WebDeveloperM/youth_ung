"""
Сериализаторы для публичного API результатов (для frontend)
"""
from rest_framework import serializers
from content.models import Result


class ResultListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка результатов"""
    
    class Meta:
        model = Result
        fields = [
            'id',
            'title_uz',
            'title_ru',
            'title_en',
            'short_description_uz',
            'short_description_ru',
            'short_description_en',
            'image',
            'category',
            'status',
            'year',
            'metrics',
            'achievements',
            'views',
            'likes',
            'is_featured',
            'created_at',
        ]
        read_only_fields = fields


class ResultDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального результата"""
    
    class Meta:
        model = Result
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
            'category',
            'status',
            'year',
            'metrics',
            'achievements',
            'views',
            'likes',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

