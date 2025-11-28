from rest_framework import serializers
from content.models import News


class NewsAdminSerializer(serializers.ModelSerializer):
    """Сериализатор для админки - все поля доступны для редактирования"""
    
    class Meta:
        model = News
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'content_uz', 'content_ru', 'content_en',
            'image',
            'date',
            'likes', 'views',
            'is_published', 'is_featured',
            'created_at', 'updated_at',
            'created_by', 'updated_by',
        ]
        read_only_fields = ['id', 'likes', 'views', 'created_at', 'updated_at', 'created_by', 'updated_by']
    
    def create(self, validated_data):
        # ОТЛАДКА: Логируем что пришло
        import logging
        logger = logging.getLogger(__name__)
        logger.error('=' * 80)
        logger.error('📥 SERIALIZER CREATE - ПОЛУЧЕНЫ ДАННЫЕ:')
        for key, value in validated_data.items():
            logger.error(f'  ✅ {key}: {type(value).__name__} = {value[:100] if isinstance(value, str) else value}')
        logger.error('=' * 80)
        
        # Устанавливаем created_by из request.user
        request = self.context.get('request')
        if request and request.user:
            validated_data['created_by'] = request.user
        
        result = super().create(validated_data)
        logger.error(f'✅ СОЗДАНО: ID={result.id}')
        return result
    
    def update(self, instance, validated_data):
        # Устанавливаем updated_by из request.user
        request = self.context.get('request')
        if request and request.user:
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class NewsListAdminSerializer(serializers.ModelSerializer):
    """Облегченный сериализатор для списка (без полного контента)"""
    
    class Meta:
        model = News
        fields = [
            'id',
            'title_uz', 'title_ru', 'title_en',
            'image',
            'date',
            'likes', 'views',
            'is_published', 'is_featured',
            'created_at',
        ]

