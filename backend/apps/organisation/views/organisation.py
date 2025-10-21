from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class GetOrganisationInfoView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = GetOrganisationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
        return Response('ok')