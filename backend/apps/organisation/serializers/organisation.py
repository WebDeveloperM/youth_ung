from rest_framework import serializers
from organisation.models import Organisation


class OrganisationSerializer(serializers.ModelSerializer):
    """Базовый сериализатор организации"""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'email',
            'address',
            'phone',
            'avatar',
            'avatar_url',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class OrganisationListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка организаций (облегченный)"""
    
    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'email',
            'phone',
        )


class OrganisationDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор организации"""
    avatar_url = serializers.SerializerMethodField()
    employees_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'email',
            'address',
            'phone',
            'avatar',
            'avatar_url',
            'employees_count',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'employees_count')
    
    def get_avatar_url(self, obj):
        """Получить полный URL аватара"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None
    
    def get_employees_count(self, obj):
        """Получить количество сотрудников"""
        from users.models import User
        return User.objects.filter(organization=obj).count()


