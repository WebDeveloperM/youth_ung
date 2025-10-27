from organisation.models import New
from rest_framework import serializers


class GetCategoryNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = New
        fields = ('title',)


class GetNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = New
        fields = '__all__'

