"""
Сериализаторы для публичного API проектов (для frontend)
"""
from rest_framework import serializers
from content.models import Project


class ProjectListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка проектов"""
    
    class Meta:
        model = Project
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
            'budget',
            'duration',
            'status',
            'progress',
            'start_date',
            'end_date',
            'views',
            'likes',
            'is_featured',
            'created_at',
        ]
        read_only_fields = fields


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального проекта"""
    
    class Meta:
        model = Project
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
            'budget',
            'duration',
            'status',
            'progress',
            'team',
            'location',
            'start_date',
            'end_date',
            'views',
            'likes',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

