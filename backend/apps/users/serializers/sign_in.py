from django.utils import timezone
from rest_framework import serializers
from users.models import User, Token


class SignInSerializer(serializers.Serializer):
    """Сериализатор для входа пользователя"""

    login = serializers.CharField(help_text="Email или username")
    password = serializers.CharField(write_only=True, help_text="Пароль")

    def validate(self, data):
        """Проверка данных для входа"""
        login = data.get('login')
        password = data.get('password')

        if not login or not password:
            raise serializers.ValidationError("Необходимо указать логин и пароль")

        # Пробуем найти пользователя по email или username
        user = None
        if '@' in login:
            user = User.objects.filter(email=login).first()
        else:
            user = User.objects.filter(username=login).first()

        # Используем одно сообщение для обоих случаев (user не найден / неверный пароль),
        # чтобы избежать утечки информации (user enumeration attack)
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Неверный логин или пароль")

        # Проверяем, активен ли пользователь
        if not user.is_active:
            raise serializers.ValidationError("Аккаунт деактивирован")
        
        # Создаем или получаем активный и не просроченный токен
        token = Token.objects.filter(user=user, is_active=True, expires_at__gte=timezone.now()).first()
        if not token:
            token = Token.objects.create(user=user)
        
        data['user'] = user
        data['token'] = token.key
        
        return data
    
    def to_representation(self, instance):
        """Формирование ответа"""
        user = instance['user']
        return {
            'token': instance['token'],
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': user.phone,
                'role': user.role,
                'avatar': user.avatar.url if user.avatar else None,
                'allowed_menus': user.allowed_menus if hasattr(user, 'allowed_menus') else [],
            },
            'message': 'Вход выполнен успешно!'
        }
