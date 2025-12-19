"""
Сериализаторы для публичного API исследований (для frontend)
"""
from rest_framework import serializers
from content.models import Research


class ResearchListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка исследований"""
    
    class Meta:
        model = Research
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
            'authors',
            'department',
            'start_date',
            'end_date',
            'status',
            'publications',
            'citations',
            'views',
            'likes',
            'is_featured',
            'created_at',
        ]
        read_only_fields = fields


class ResearchDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального исследования"""
    
    class Meta:
        model = Research
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
            'authors',
            'department',
            'start_date',
            'end_date',
            'status',
            'publications',
            'citations',
            'budget',
            'views',
            'likes',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

