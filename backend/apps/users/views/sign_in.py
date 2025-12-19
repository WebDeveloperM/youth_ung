from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from django.utils.decorators import method_decorator
from users.serializers.sign_in import SignInSerializer


# Rate limiting decorator для защиты от brute-force атак
@method_decorator(ratelimit(key='ip', rate='5/m', method='POST'), name='post')
class SignInView(APIView):
    """
    API endpoint для входа пользователя
    
    Rate Limiting: 5 попыток в минуту с одного IP
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        """
        Вход пользователя в систему
        
        Принимает данные:
        - login: Email или username
        - password: Пароль
        
        Возвращает:
        - Данные пользователя и токен аутентификации
        
        Rate limit: 5 попыток в минуту
        """
        try:
            serializer = SignInSerializer(data=request.data)
            
            if serializer.is_valid():
                response_data = serializer.to_representation(serializer.validated_data)
                return Response(response_data, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Ratelimited:
            return Response({
                'error': 'Слишком много попыток входа. Пожалуйста, подождите 1 минуту.',
                'detail': 'Too many login attempts. Please wait 1 minute.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
