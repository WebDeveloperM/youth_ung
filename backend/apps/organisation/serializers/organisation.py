from backend.apps.organisation.models import Organisation
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed


class GetOrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'
