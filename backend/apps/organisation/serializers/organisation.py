from organisation.models import Organisation
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from organisation.serializers.department import DepartmentSerializer


class GetOrganisationSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Organisation
        fields = ['id', 'name', 'email', 'address', 'avatar', 'phone', 'departments']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation