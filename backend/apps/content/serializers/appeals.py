from rest_framework import serializers
from content.models import Appeal
from django.utils import timezone


class AppealCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания обращения"""
    
    class Meta:
        model = Appeal
        fields = [
            'language',
            'subject',
            'message',
            'is_anonymous',
        ]
    
    def create(self, validated_data):
        # Добавляем текущего пользователя
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AppealListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка обращений (для админа)"""
    
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    
    class Meta:
        model = Appeal
        fields = [
            'id',
            'user',
            'user_name',
            'user_email',
            'language',
            'language_display',
            'subject',
            'message',
            'is_anonymous',
            'status',
            'status_display',
            'created_at',
            'updated_at',
        ]
    
    def get_user_name(self, obj):
        """Получить имя пользователя или 'Аноним'"""
        return obj.get_display_name()
    
    def get_user_email(self, obj):
        """Получить email или скрыть если анонимно"""
        if obj.is_anonymous:
            return "***@***.***"
        return obj.user.email if obj.user else None


class AppealDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального просмотра обращения"""
    
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    resolved_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Appeal
        fields = [
            'id',
            'user',
            'user_name',
            'user_email',
            'user_phone',
            'language',
            'language_display',
            'subject',
            'message',
            'is_anonymous',
            'status',
            'status_display',
            'admin_response',
            'resolved_by',
            'resolved_by_name',
            'resolved_at',
            'created_at',
            'updated_at',
        ]
    
    def get_user_name(self, obj):
        return obj.get_display_name()
    
    def get_user_email(self, obj):
        if obj.is_anonymous:
            return "***@***.***"
        return obj.user.email if obj.user else None
    
    def get_user_phone(self, obj):
        if obj.is_anonymous:
            return "***"
        return getattr(obj.user, 'phone', None)
    
    def get_resolved_by_name(self, obj):
        if obj.resolved_by:
            return f"{obj.resolved_by.first_name} {obj.resolved_by.last_name}".strip() or obj.resolved_by.username
        return None


class AppealUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления статуса обращения (админ)"""
    
    class Meta:
        model = Appeal
        fields = ['status', 'admin_response']
    
    def update(self, instance, validated_data):
        # Если статус меняется на resolved, сохраняем кто и когда решил
        if validated_data.get('status') == 'resolved' and instance.status != 'resolved':
            validated_data['resolved_at'] = timezone.now()
            validated_data['resolved_by'] = self.context['request'].user
        
        return super().update(instance, validated_data)

