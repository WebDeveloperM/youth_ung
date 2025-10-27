from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

from users.models import Token
# from users.serializers.user import UserSerializer

from users.serializers.user import UserDetailSerializer


class CustomTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        token = Token.objects.select_related('user').filter(key=key, expires_at__gte=timezone.now()).first()

        if token is None:
            raise AuthenticationFailed(_('Invalid or expired token.'))

        if not token.user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        if not token.is_active:
            raise AuthenticationFailed(_('Your token is not active.'))

        return token.user, token


# def check_in_response(user):
#     Token.objects.filter(user=user).update(is_active=False)
#     token = Token.objects.create(user=user)
#     data = UserSerializer(user).data
#     return {'token': token.key, 'user': data}


def sign_in_response(user):
    token = Token.objects.create(user=user)
    data = UserDetailSerializer(user).data
    return {'token': token.key, 'user': data}