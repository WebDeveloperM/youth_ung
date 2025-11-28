"""
Сериализаторы для публичного API новостей (для frontend)
"""
from rest_framework import serializers
from content.models import News


class NewsListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка новостей"""
    
    class Meta:
        model = News
        fields = [
            'id',
            'title_uz',
            'title_ru',
            'title_en',
            'content_uz',
            'content_ru',
            'content_en',
            'image',
            'date',
            'views',
            'likes',
            'is_featured',
            'created_at',
        ]
        read_only_fields = fields


class NewsDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной новости"""
    
    class Meta:
        model = News
        fields = [
            'id',
            'title_uz',
            'title_ru',
            'title_en',
            'content_uz',
            'content_ru',
            'content_en',
            'image',
            'date',
            'views',
            'likes',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

