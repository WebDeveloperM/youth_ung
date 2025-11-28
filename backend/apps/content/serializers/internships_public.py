from rest_framework import serializers
from content.models import Internship


class InternshipListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка стажировок (публичный API)"""
    
    class Meta:
        model = Internship
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'short_description_uz', 'short_description_ru', 'short_description_en',
            'image',
            'stipend',
            'duration',
            'deadline',
            'start_date',
            'status',
            'category',
            'applicants',
            'positions',
            'created_at',
        ]


class InternshipDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о стажировке (публичный API)"""
    
    class Meta:
        model = Internship
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'short_description_uz', 'short_description_ru', 'short_description_en',
            'content_uz', 'content_ru', 'content_en',
            'image',
            'stipend',
            'duration',
            'deadline',
            'start_date',
            'status',
            'category',
            'applicants',
            'positions',
            'created_at',
            'updated_at',
        ]

