"""
Сериализаторы для заявок
"""
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from content.models_applications import Application


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания заявки (публичный API)"""
    
    content_type = serializers.CharField(help_text="Тип контента: grant, scholarship, competition")
    object_id = serializers.IntegerField(help_text="ID объекта")
    
    class Meta:
        model = Application
        fields = [
            'full_name',
            'email',
            'phone',
            'organization',
            'position',
            'experience',
            'motivation',
            'cv_file',
            'portfolio_file',
            'content_type',
            'object_id',
        ]
    
    def validate_content_type(self, value):
        """Валидация типа контента"""
        allowed_types = ['grant', 'scholarship', 'competition', 'internship', 'job']
        if value not in allowed_types:
            raise serializers.ValidationError(f"Недопустимый тип. Разрешены: {', '.join(allowed_types)}")
        return value
    
    def validate(self, data):
        """Валидация всех данных"""
        content_type_str = data.get('content_type')
        object_id = data.get('object_id')
        
        # Получаем ContentType
        try:
            content_type = ContentType.objects.get(
                app_label='content',
                model=content_type_str
            )
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"content_type": "Тип контента не найден"})
        
        # Проверяем что объект существует
        model_class = content_type.model_class()
        if not model_class.objects.filter(id=object_id).exists():
            raise serializers.ValidationError({"object_id": f"{content_type_str.capitalize()} с ID {object_id} не найден"})
        
        data['content_type'] = content_type
        return data
    
    def create(self, validated_data):
        """Создание заявки"""
        # Если пользователь авторизован, сохраняем его
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        application = Application.objects.create(**validated_data)
        
        # Обновляем счетчик (для разных моделей разные поля)
        content_object = application.content_object
        if hasattr(content_object, 'applicants'):
            # Для Grant
            content_object.applicants += 1
            content_object.save(update_fields=['applicants'])
        elif hasattr(content_object, 'recipients'):
            # Для Scholarship
            content_object.recipients += 1
            content_object.save(update_fields=['recipients'])
        elif hasattr(content_object, 'participants'):
            # Для Competition
            content_object.participants += 1
            content_object.save(update_fields=['participants'])
        elif hasattr(content_object, 'positions'):
            # Для Job, Internship
            # Ничего не обновляем - positions это количество мест, а не заявок
            pass
        
        return application


class ApplicationListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка заявок (админка)"""
    
    content_type_name = serializers.CharField(read_only=True)
    content_title = serializers.CharField(read_only=True)
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'organization',
            'content_type_name',
            'content_title',
            'object_id',
            'status',
            'user_email',
            'created_at',
        ]
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной заявки (админка)"""
    
    content_type_name = serializers.CharField(read_only=True)
    content_title = serializers.CharField(read_only=True)
    user_info = serializers.SerializerMethodField()
    reviewed_by_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id',
            'user',
            'user_info',
            'full_name',
            'email',
            'phone',
            'organization',
            'position',
            'experience',
            'motivation',
            'cv_file',
            'portfolio_file',
            'content_type',
            'content_type_name',
            'content_title',
            'object_id',
            'status',
            'admin_comment',
            'reviewed_by',
            'reviewed_by_info',
            'reviewed_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'content_type', 'object_id', 'created_at', 'updated_at']
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'username': obj.user.username,
                'email': obj.user.email,
                'full_name': f"{obj.user.first_name} {obj.user.last_name}",
            }
        return None
    
    def get_reviewed_by_info(self, obj):
        if obj.reviewed_by:
            return {
                'id': obj.reviewed_by.id,
                'username': obj.reviewed_by.username,
                'full_name': f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}",
            }
        return None

