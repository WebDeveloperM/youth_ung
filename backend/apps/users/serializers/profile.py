from rest_framework import serializers
from users.models import User
from organisation.models import Organisation
from django.contrib.auth.hashers import make_password


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer для получения и обновления профиля пользователя
    """
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    avatar_url = serializers.SerializerMethodField()
    
    # Поля для смены пароля (только для записи)
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_of_birth',
            'phone',
            'address',
            'gender',
            'position',
            'organization',
            'organization_name',
            'avatar',
            'avatar_url',
            'role',
            'allowed_menus',
            'is_superuser',
            'current_password',
            'new_password',
            'confirm_password',
        ]
        read_only_fields = ['id', 'email', 'role', 'allowed_menus', 'is_superuser']  # Email, роль, права и is_superuser нельзя менять через профиль
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def validate(self, data):
        """Валидация данных"""
        # Проверка смены пароля
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        
        # Если хотя бы одно поле пароля заполнено
        if any([current_password, new_password, confirm_password]):
            # Проверяем что заполнены все три
            if not all([current_password, new_password, confirm_password]):
                raise serializers.ValidationError({
                    'password': 'Для смены пароля необходимо заполнить все поля: текущий пароль, новый пароль и подтверждение.'
                })
            
            # Проверяем текущий пароль
            user = self.instance
            if not user.check_password(current_password):
                raise serializers.ValidationError({
                    'current_password': 'Неверный текущий пароль.'
                })
            
            # Проверяем совпадение нового пароля
            if new_password != confirm_password:
                raise serializers.ValidationError({
                    'confirm_password': 'Новый пароль и подтверждение не совпадают.'
                })
            
            # Проверяем минимальную длину
            if len(new_password) < 6:
                raise serializers.ValidationError({
                    'new_password': 'Пароль должен содержать минимум 6 символов.'
                })
        
        return data
    
    def update(self, instance, validated_data):
        """Обновление профиля"""
        # Удаляем поля пароля из validated_data
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('confirm_password', None)
        
        # Обновляем обычные поля
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Если меняем пароль
        if new_password:
            instance.set_password(new_password)
        
        instance.save()
        return instance


class AvatarUploadSerializer(serializers.ModelSerializer):
    """
    Serializer для загрузки аватара
    """
    avatar = serializers.ImageField(required=True)
    avatar_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['avatar', 'avatar_url']
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def validate_avatar(self, value):
        """Валидация загружаемого файла"""
        # Проверка размера файла (макс 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Размер файла не должен превышать 5MB.')
        
        # Проверка типа файла
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Разрешены только изображения (JPEG, PNG, GIF, WebP).')
        
        return value



