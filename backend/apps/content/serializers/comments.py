from rest_framework import serializers
from content.models_comments import Comment
from django.contrib.contenttypes.models import ContentType


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer для комментариев
    """
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_full_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    
    # Поля для создания комментария
    content_type_name = serializers.CharField(write_only=True, required=False)
    
    # Флаги для текущего пользователя
    is_liked_by_me = serializers.SerializerMethodField()
    is_disliked_by_me = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'author_name',
            'author_full_name',
            'author_avatar',
            'content',
            'content_type',
            'content_type_name',
            'object_id',
            'likes',
            'dislikes',
            'is_liked_by_me',
            'is_disliked_by_me',
            'can_delete',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'author', 'likes', 'dislikes', 'created_at', 'updated_at', 'content_type']
    
    def get_author_full_name(self, obj):
        """Полное имя автора"""
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
    
    def get_author_avatar(self, obj):
        """URL аватара автора"""
        if obj.author.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.avatar.url)
            return obj.author.avatar.url
        return None
    
    def get_is_liked_by_me(self, obj):
        """Лайкнул ли текущий пользователь этот комментарий"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False
    
    def get_is_disliked_by_me(self, obj):
        """Дизлайкнул ли текущий пользователь этот комментарий"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.disliked_by.filter(id=request.user.id).exists()
        return False
    
    def get_can_delete(self, obj):
        """Может ли текущий пользователь удалить этот комментарий"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Автор или админ может удалить
            return obj.author.id == request.user.id or request.user.is_staff
        return False
    
    def create(self, validated_data):
        """Создание комментария"""
        # Удаляем content_type_name если есть
        content_type_name = validated_data.pop('content_type_name', None)
        
        # Получаем content_type из контекста или по названию модели
        content_type = validated_data.get('content_type')
        if not content_type and content_type_name:
            # Мапинг названий моделей
            content_type_map = {
                'news': 'news',
                'innovation': 'innovation',
                'grant': 'grant',
                'scholarship': 'scholarship',
                'competition': 'competition',
                'internship': 'internship',
                'job': 'job',
                'project': 'project',
                'research': 'research',
            }
            
            model_name = content_type_map.get(content_type_name.lower())
            if model_name:
                content_type = ContentType.objects.get(app_label='content', model=model_name)
                validated_data['content_type'] = content_type
        
        # Устанавливаем автора
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
        
        return super().create(validated_data)


class CommentCreateSerializer(serializers.Serializer):
    """
    Упрощенный serializer для создания комментария
    """
    content = serializers.CharField(required=True, max_length=5000)
    content_type = serializers.CharField(required=True)  # 'news', 'innovation', etc.
    object_id = serializers.IntegerField(required=True)
    
    def validate_content(self, value):
        """Валидация содержания"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError('Комментарий должен содержать минимум 3 символа.')
        return value.strip()
    
    def validate_content_type(self, value):
        """Валидация типа контента"""
        allowed_types = ['news', 'innovation', 'grant', 'scholarship', 'competition', 'internship', 'job', 'project', 'research']
        value_lower = value.lower()
        if value_lower not in allowed_types:
            raise serializers.ValidationError(f'Недопустимый тип контента. Разрешены: {", ".join(allowed_types)}')
        return value_lower
    
    def create(self, validated_data):
        """Создание комментария"""
        content_type_name = validated_data.pop('content_type')
        
        # Получаем ContentType
        try:
            content_type = ContentType.objects.get(app_label='content', model=content_type_name)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({'content_type': f'Тип контента "{content_type_name}" не найден.'})
        
        # Создаем комментарий
        request = self.context.get('request')
        comment = Comment.objects.create(
            author=request.user,
            content=validated_data['content'],
            content_type=content_type,
            object_id=validated_data['object_id'],
        )
        
        return comment



