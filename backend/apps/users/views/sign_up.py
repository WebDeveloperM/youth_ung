from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers.sign_up import SignUpSerializer
from users.serializers.sign_in import SignInSerializer



# from users.serializers.sign_in import SignUpSerializer


class SignUpView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'status': True,
            'message': 'User created successfully',
            'user': serializer.data,
        }, status=201)