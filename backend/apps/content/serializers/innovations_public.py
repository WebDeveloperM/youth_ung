from rest_framework import serializers
from content.models import Innovation


class InnovationListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка инноваций (публичный API)"""
    
    class Meta:
        model = Innovation
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'image',
            'date',
            'category',
            'likes',
            'views',
            'is_featured',
            'created_at',
        ]


class InnovationDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации об инновации (публичный API)"""
    
    class Meta:
        model = Innovation
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'content_uz', 'content_ru', 'content_en',
            'image',
            'date',
            'category',
            'likes',
            'views',
            'is_featured',
            'created_at',
            'updated_at',
        ]


