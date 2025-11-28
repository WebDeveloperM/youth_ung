"""
Сериализаторы для публичного API грантов (для frontend)
"""
from rest_framework import serializers
from content.models import Grant


class GrantListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка грантов"""
    
    class Meta:
        model = Grant
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
            'applicants',
            'created_at',
        ]
        read_only_fields = fields


class GrantDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального гранта"""
    
    class Meta:
        model = Grant
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
            'applicants',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

