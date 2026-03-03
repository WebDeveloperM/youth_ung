from django.urls import path

from users.views.info_user import InfoUserView
from users.views.sign_up import SignUpView
from users.views.sign_in import SignInView
from users.views.profile import ProfileView, AvatarUploadView
from users.views.token import SwaggerTokenView

urlpatterns = [
    path('info_user', InfoUserView.as_view(), name='info_user'),
    path('sign-up/', SignUpView.as_view(), name='signup'),
    path('sign-in/', SignInView.as_view(), name='signin'),
    path('token/', SwaggerTokenView.as_view(), name='swagger_token'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='avatar_upload'),
]
