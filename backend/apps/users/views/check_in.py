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
#         serializer = CheckInSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         return Response(check_in_response(user))
