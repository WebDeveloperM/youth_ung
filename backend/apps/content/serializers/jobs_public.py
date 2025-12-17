from rest_framework import serializers
from content.models import Job


class JobPublicSerializer(serializers.ModelSerializer):
    """Сериализатор для вакансий (публичный API)"""
    
    class Meta:
        model = Job
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'short_description_uz', 'short_description_ru', 'short_description_en',
            'content_uz', 'content_ru', 'content_en',
            'image',
            'salary',
            'location',
            'type',
            'experience',
            'deadline',
            'status',
            'category',
            'employment_type',
            'applicants',
            'positions',
            'created_at',
            'updated_at',
        ]

