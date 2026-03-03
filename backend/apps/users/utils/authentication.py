from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from users.models import Token
from users.serializers.user import UserSerializer


class CustomTokenAuthentication(TokenAuthentication):
    """
    Accepts both 'Token <key>' and 'Bearer <key>' in the Authorization header.
    'Bearer' is used by Swagger UI OAuth2 flow; 'Token' is used by all clients.
    """

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth:
            return None

        prefix = auth[0].lower()
        if prefix not in (b'token', b'bearer'):
            return None

        if len(auth) == 1:
            raise AuthenticationFailed(_('Invalid token header. No credentials provided.'))
        if len(auth) > 2:
            raise AuthenticationFailed(_('Invalid token header. Token string should not contain spaces.'))

        try:
            key = auth[1].decode()
        except UnicodeError:
            raise AuthenticationFailed(_('Invalid token header. Token string contains invalid characters.'))

        return self.authenticate_credentials(key)

    def authenticate_credentials(self, key):
        token = Token.objects.select_related('user').filter(key=key, expires_at__gte=timezone.now()).first()

        if token is None:
            raise AuthenticationFailed(_('Invalid or expired token.'))

        if not token.user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        if not token.is_active:
            raise AuthenticationFailed(_('Your token is not active.'))

        return token.user, token


def check_in_response(user):
    Token.objects.filter(user=user).update(is_active=False)
    token = Token.objects.create(user=user)
    data = UserSerializer(user).data
    return {'token': token.key, 'user': data}
