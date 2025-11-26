from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from users.serializers.profile import ProfileSerializer, AvatarUploadSerializer
from users.utils.authentication import CustomTokenAuthentication


class ProfileView(APIView):
    """
    API для получения и обновления профиля текущего пользователя
    GET: Получить данные профиля
    PUT/PATCH: Обновить данные профиля
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get(self, request):
        """Получить данные профиля текущего пользователя"""
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Полное обновление профиля"""
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=False,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Профиль успешно обновлен',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Частичное обновление профиля"""
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Профиль успешно обновлен',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    """
    API для загрузки аватара
    POST: Загрузить новый аватар
    DELETE: Удалить аватар
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        """Загрузить новый аватар"""
        serializer = AvatarUploadSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Удаляем старый аватар если есть
            if request.user.avatar:
                old_avatar = request.user.avatar
                try:
                    old_avatar.delete(save=False)
                except Exception as e:
                    print(f"Error deleting old avatar: {e}")
            
            serializer.save()
            return Response({
                'message': 'Аватар успешно загружен',
                'avatar_url': serializer.data['avatar_url']
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Удалить аватар"""
        user = request.user
        if user.avatar:
            user.avatar.delete(save=True)
            return Response({
                'message': 'Аватар успешно удален'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'У пользователя нет аватара'
        }, status=status.HTTP_400_BAD_REQUEST)

