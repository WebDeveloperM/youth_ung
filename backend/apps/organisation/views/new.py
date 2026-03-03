from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from organisation.serializers.new import GetCategoryNewSerializer, GetNewSerializer
from organisation.models import New, CategoryNew


class CategoryNewApiView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        organisation = CategoryNew.objects.list()
        serializer = GetCategoryNewSerializer(organisation, many=True)
        return Response({
            'status': True,
            'message': "All new's category",
            'Categories': serializer.data,
        }, status=200)


class AllNewApiView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        organisation = New.objects.list()
        serializer = GetNewSerializer(organisation, many=True)
        return Response({
            'status': True,
            'message': "All news",
            'News': serializer.data,
        }, status=200)