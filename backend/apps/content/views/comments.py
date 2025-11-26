from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.contrib.contenttypes.models import ContentType

from content.models_comments import Comment
from content.serializers.comments import CommentSerializer, CommentCreateSerializer
from users.utils.authentication import CustomTokenAuthentication


class CommentListCreateView(APIView):
    """
    GET: Получить список комментариев для определенного объекта
    POST: Создать новый комментарий
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        """
        Получить комментарии для объекта
        Query params:
        - content_type: тип контента (news, innovation, etc.)
        - object_id: ID объекта
        """
        content_type_name = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        if not content_type_name or not object_id:
            return Response({
                'error': 'Необходимы параметры content_type и object_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            content_type = ContentType.objects.get(app_label='content', model=content_type_name.lower())
        except ContentType.DoesNotExist:
            return Response({
                'error': f'Тип контента "{content_type_name}" не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Получаем комментарии
        comments = Comment.objects.filter(
            content_type=content_type,
            object_id=object_id,
            is_deleted=False,
            is_moderated=True
        ).select_related('author').prefetch_related('liked_by', 'disliked_by').order_by('-created_at')
        
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Создать новый комментарий"""
        serializer = CommentCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            comment = serializer.save()
            # Возвращаем созданный комментарий с полной информацией
            response_serializer = CommentSerializer(comment, context={'request': request})
            return Response({
                'message': 'Комментарий успешно добавлен',
                'comment': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    """
    GET: Получить один комментарий
    DELETE: Удалить комментарий (только автор или админ)
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_comment(self, comment_id):
        """Получить комментарий по ID"""
        try:
            return Comment.objects.select_related('author').get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return None
    
    def get(self, request, comment_id):
        """Получить комментарий"""
        comment = self.get_comment(comment_id)
        if not comment:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, comment_id):
        """Удалить комментарий"""
        comment = self.get_comment(comment_id)
        if not comment:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Проверка прав
        if comment.author.id != request.user.id and not request.user.is_staff:
            return Response({
                'error': 'У вас нет прав для удаления этого комментария'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Мягкое удаление
        comment.is_deleted = True
        comment.save()
        
        return Response({
            'message': 'Комментарий успешно удален'
        }, status=status.HTTP_200_OK)


class CommentLikeView(APIView):
    """
    POST: Лайкнуть комментарий
    DELETE: Убрать лайк
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, comment_id):
        """Лайкнуть комментарий"""
        try:
            comment = Comment.objects.get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        success = comment.like(request.user)
        
        return Response({
            'message': 'Лайк добавлен' if success else 'Вы уже лайкнули этот комментарий',
            'likes': comment.likes,
            'dislikes': comment.dislikes
        }, status=status.HTTP_200_OK)
    
    def delete(self, request, comment_id):
        """Убрать лайк"""
        try:
            comment = Comment.objects.get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        success = comment.unlike(request.user)
        
        return Response({
            'message': 'Лайк удален' if success else 'Вы не лайкали этот комментарий',
            'likes': comment.likes,
            'dislikes': comment.dislikes
        }, status=status.HTTP_200_OK)


class CommentDislikeView(APIView):
    """
    POST: Дизлайкнуть комментарий
    DELETE: Убрать дизлайк
    """
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, comment_id):
        """Дизлайкнуть комментарий"""
        try:
            comment = Comment.objects.get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        success = comment.dislike(request.user)
        
        return Response({
            'message': 'Дизлайк добавлен' if success else 'Вы уже дизлайкнули этот комментарий',
            'likes': comment.likes,
            'dislikes': comment.dislikes
        }, status=status.HTTP_200_OK)
    
    def delete(self, request, comment_id):
        """Убрать дизлайк"""
        try:
            comment = Comment.objects.get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return Response({
                'error': 'Комментарий не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        success = comment.undislike(request.user)
        
        return Response({
            'message': 'Дизлайк удален' if success else 'Вы не дизлайкали этот комментарий',
            'likes': comment.likes,
            'dislikes': comment.dislikes
        }, status=status.HTTP_200_OK)



