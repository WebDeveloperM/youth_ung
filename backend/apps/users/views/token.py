from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from users.models import User, Token


class SwaggerTokenView(APIView):
    """
    OAuth2-compatible token endpoint used by Swagger UI.
    Accepts email/username + password and returns an access token.
    """
    permission_classes = (AllowAny,)

    @swagger_auto_schema(
        operation_summary="Obtain access token (Swagger login)",
        operation_description=(
            "Used by Swagger UI Authorize dialog.\n\n"
            "Send `username` (email or username) and `password` as form fields."
        ),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Email or username',
                ),
                'password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Password',
                ),
            },
        ),
        responses={
            200: openapi.Response(
                description='Token issued',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'access_token': openapi.Schema(type=openapi.TYPE_STRING),
                        'token_type': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            401: 'Invalid credentials',
        },
        tags=['auth'],
    )
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'username and password are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = None
        if '@' in username:
            user = User.objects.filter(email=username).first()
        else:
            user = User.objects.filter(username=username).first()

        if not user or not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is deactivated'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = Token.objects.filter(
            user=user,
            is_active=True,
            expires_at__gte=timezone.now(),
        ).first()
        if not token:
            token = Token.objects.create(user=user)

        return Response({
            'access_token': token.key,
            'token_type': 'bearer',
        }, status=status.HTTP_200_OK)
