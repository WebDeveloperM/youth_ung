from rest_framework import serializers

from organisation.models import  Department
from organisation.serializers.section import SectionSerializer


class DepartmentSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'sections']