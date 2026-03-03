from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from organisation.serializers.organisation import GetOrganisationSerializer
from organisation.models import Organisation


class GetOrganisationInfoView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        organisation = Organisation.objects.list()
        serializer = GetOrganisationSerializer(organisation, many=True)
        return Response({
            'status': True,
            'message': 'All organisations',
            'organisations': serializer.data,
        }, status=200)
