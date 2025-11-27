from django.urls import path
from content.views.comments import (
    CommentListCreateView,
    CommentDetailView,
    CommentLikeView,
    CommentDislikeView
)

urlpatterns = [
    # Список и создание комментариев
    path('', CommentListCreateView.as_view(), name='comment-list-create'),
    
    # Детали комментария
    path('<int:comment_id>/', CommentDetailView.as_view(), name='comment-detail'),
    
    # Лайки
    path('<int:comment_id>/like/', CommentLikeView.as_view(), name='comment-like'),
    
    # Дизлайки
    path('<int:comment_id>/dislike/', CommentDislikeView.as_view(), name='comment-dislike'),
]



