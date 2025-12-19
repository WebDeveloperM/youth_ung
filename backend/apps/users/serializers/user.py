from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    """Полный сериализатор пользователя"""
    avatar_url = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'avatar',
            'avatar_url',
            'role',
            'is_active',
            'date_joined',
            'last_login',
            'organization',
            'organization_name',
            'position',
            'date_of_birth',
            'address',
            'gender',
            # Образование
            'education_level',
            'is_foreign_graduate',
            'is_top300_graduate',
            'is_top500_graduate',
            # Тип сотрудника
            'staff_type',
            'is_promoted',
            # Языковые сертификаты
            'has_ielts',
            'has_cefr',
            'has_topik',
            # Научные степени
            'scientific_degree',
            # Лидерские позиции
            'leadership_position',
            # Государственные награды
            'state_award_type',
        )
        read_only_fields = ('id', 'date_joined', 'last_login')
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def get_organization_name(self, obj):
        """Получить название организации"""
        if obj.organization:
            return obj.organization.name
        return None


class UserListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка пользователей"""
    avatar_url = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'avatar_url',
            'role',
            'is_active',
            'date_joined',
            'last_login',
            'organization_name',
        )
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def get_organization_name(self, obj):
        """Получить название организации"""
        if obj.organization:
            return obj.organization.name
        return None


class UserDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о пользователе"""
    avatar_url = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'avatar',
            'avatar_url',
            'role',
            'is_active',
            'date_joined',
            'last_login',
            'organization',
            'organization_name',
        )
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def get_organization_name(self, obj):
        """Получить название организации"""
        if obj.organization:
            return obj.organization.name
        return None


class UserAvatarSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField()

    class Meta:
        model = User
        fields = ('id', 'avatar')


class UserUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления пользователя (для координаторов)"""
    
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'phone',
            'position',
            'date_of_birth',
            'address',
            'gender',
            'avatar',
            # Образование
            'education_level',
            'is_foreign_graduate',
            'is_top300_graduate',
            'is_top500_graduate',
            # Тип сотрудника
            'staff_type',
            'is_promoted',
            # Языковые сертификаты
            'has_ielts',
            'has_cefr',
            'has_topik',
            # Научные степени
            'scientific_degree',
            # Лидерские позиции
            'leadership_position',
            # Государственные награды
            'state_award_type',
        )
        read_only_fields = ('id',)
    
    def validate(self, data):
        """Валидация данных"""
        # Координаторы НЕ могут изменять:
        # - username
        # - email
        # - password
        # - role
        # - organization
        # - is_active
        return data
