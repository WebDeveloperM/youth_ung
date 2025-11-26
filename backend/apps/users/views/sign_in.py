from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from users.serializers.sign_in import SignInSerializer


class SignInView(APIView):
    """API endpoint для входа пользователя"""
    permission_classes = (AllowAny,)
    
    def post(self, request):
        """
        Вход пользователя в систему
        
        Принимает данные:
        - login: Email или username
        - password: Пароль
        
        Возвращает:
        - Данные пользователя и токен аутентификации
        """
        serializer = SignInSerializer(data=request.data)
        
        if serializer.is_valid():
            response_data = serializer.to_representation(serializer.validated_data)
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
