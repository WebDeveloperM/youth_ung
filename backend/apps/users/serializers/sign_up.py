from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password as django_validate_password
from rest_framework import serializers
from organisation.models import Organisation
from users.models import User, Token


class SignUpSerializer(serializers.Serializer):
    """Сериализатор для регистрации пользователя"""
    
    # Личные данные
    full_name = serializers.CharField(max_length=200, help_text="Полное имя")
    date_of_birth = serializers.DateField(help_text="Дата рождения")
    phone_number = serializers.CharField(max_length=20, help_text="Номер телефона")
    residential_address = serializers.CharField(max_length=500, help_text="Адрес проживания")
    
    # Рабочая информация
    place_of_work = serializers.IntegerField(required=False, allow_null=True, help_text="ID организации")
    position = serializers.CharField(max_length=100, required=False, allow_blank=True, help_text="Должность")
    
    # Данные для входа
    login = serializers.CharField(max_length=150, help_text="Логин (email или username)")
    password = serializers.CharField(
        min_length=12,  # ✅ УСИЛЕНО: было 6, теперь 12
        write_only=True, 
        help_text="Пароль (минимум 12 символов)"
    )
    confirm_password = serializers.CharField(
        min_length=12,  # ✅ УСИЛЕНО: было 6, теперь 12
        write_only=True, 
        help_text="Подтверждение пароля (минимум 12 символов)"
    )
    
    def validate_login(self, value):
        """Проверка уникальности логина"""
        # Проверяем как email, так и username
        if User.objects.filter(email=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким логином уже существует")
        return value
    
    def validate_phone_number(self, value):
        """Проверка уникальности телефона"""
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Пользователь с таким номером телефона уже зарегистрирован")
        return value
    
    def validate_password(self, value):
        """
        Валидация пароля по Django правилам
        
        Проверяет:
        - Минимум 12 символов
        - Не похож на username/email
        - Не входит в список популярных паролей
        - Не полностью числовой
        """
        # Используем встроенные Django validators
        django_validate_password(value)
        return value
    
    def validate(self, data):
        """Общая валидация данных"""
        # Проверяем совпадение паролей
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Пароли не совпадают"})
        
        return data
    
    def create(self, validated_data):
        """Создание нового пользователя"""
        # Удаляем confirm_password из данных
        validated_data.pop('confirm_password')
        
        # Разбиваем полное имя на имя и фамилию
        full_name = validated_data.pop('full_name')
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Определяем, что использовать как email и username
        login = validated_data.pop('login')
        if '@' in login:
            email = login
            username = login.split('@')[0]
        else:
            email = f"{login}@youth.uz"  # Создаем email из username
            username = login
        
        # Получаем организацию по ID (если указан)
        organization_id = validated_data.get('place_of_work')
        organization = None
        if organization_id:
            try:
                organization = Organisation.objects.get(id=organization_id)
            except Organisation.DoesNotExist:
                raise serializers.ValidationError({"place_of_work": "Организация не найдена"})
        
        # Создаем пользователя
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=validated_data.get('date_of_birth'),
            phone=validated_data.get('phone_number'),
            address=validated_data.get('residential_address'),
            position=validated_data.get('position'),
            organization=organization,
            password=make_password(validated_data.get('password')),
            role=User.USER,
            gender='Not specified'
        )
        
        # Создаем токен для пользователя
        token = Token.objects.create(user=user)
        
        return {
            'user': user,
            'token': token.key
        }
    
    def to_representation(self, instance):
        """Формирование ответа"""
        user = instance['user']
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'token': instance['token'],
            'message': 'Регистрация прошла успешно!'
        }
