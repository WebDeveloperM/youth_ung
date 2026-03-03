# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework.views import APIView
#
# from users.serializers.check_in import CheckInSerializer
# from users.utils.authentication import check_in_response
#
#
# class CheckInView(APIView):
#     permission_classes = (AllowAny,)
#
#     def post(self, request):
#         serializers = CheckInSerializer(data=request.data)
#         serializers.is_valid(raise_exception=True)
#         user = serializers.validated_data['user']
#         return Response(check_in_response(user))
