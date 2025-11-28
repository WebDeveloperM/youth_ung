from rest_framework import serializers
from users.models import User


class AdminUserListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка администраторов"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'allowed_menus',
            'is_active',
            'date_joined',
            'last_login',
        ]
        read_only_fields = ['date_joined', 'last_login']


class AdminUserCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания администратора"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'password',
            'role',
            'allowed_menus',
            'phone',
            'organization',
            'position',
        ]
    
    def validate_role(self, value):
        """Можно создавать только Admin или Moderator"""
        if value not in [User.ADMIN, User.MODERATOR]:
            raise serializers.ValidationError("Можно создавать только администраторов или модераторов")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления администратора"""
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'password',
            'role',
            'allowed_menus',
            'is_active',
            'phone',
            'organization',
            'position',
        ]
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class AdminUserDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации об администраторе"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'allowed_menus',
            'is_active',
            'phone',
            'organization',
            'position',
            'avatar',
            'date_joined',
            'last_login',
        ]
        read_only_fields = ['date_joined', 'last_login']

