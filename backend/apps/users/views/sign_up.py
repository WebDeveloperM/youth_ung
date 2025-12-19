from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from django.utils.decorators import method_decorator
from users.serializers.sign_up import SignUpSerializer


# Rate limiting decorator для защиты от спама регистраций
@method_decorator(ratelimit(key='ip', rate='3/h', method='POST'), name='post')
class SignUpView(APIView):
    """
    API endpoint для регистрации нового пользователя
    
    Rate Limiting: 3 регистрации в час с одного IP
    """
    permission_classes = (AllowAny,)
    
    def post(self, request):
        """
        Регистрация нового пользователя
        
        Принимает данные:
        - full_name: Полное имя
        - date_of_birth: Дата рождения
        - phone_number: Номер телефона
        - residential_address: Адрес проживания
        - place_of_work: Место работы
        - position: Должность
        - login: Логин (email или username)
        - password: Пароль
        - confirm_password: Подтверждение пароля
        
        Возвращает:
        - Данные пользователя и токен аутентификации
        
        Rate limit: 3 регистрации в час с одного IP
        """
        try:
            serializer = SignUpSerializer(data=request.data)
            
            if serializer.is_valid():
                user_data = serializer.save()
                response_data = serializer.to_representation(user_data)
                return Response(response_data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Ratelimited:
            return Response({
                'error': 'Слишком много попыток регистрации. Пожалуйста, подождите 1 час.',
                'detail': 'Too many registration attempts. Please wait 1 hour.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
