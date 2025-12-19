"""
Сериализаторы для публичного API технологий (для frontend)
"""
from rest_framework import serializers
from content.models import Technology


class TechnologyListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка технологий"""
    
    class Meta:
        model = Technology
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
            'date',
            'views',
            'likes',
            'is_featured',
            'created_at',
        ]
        read_only_fields = fields


class TechnologyDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной технологии"""
    
    class Meta:
        model = Technology
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
            'date',
            'views',
            'likes',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

