from rest_framework import serializers
from users.models import User


class UserDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)


    class Meta:
        model = User
        fields = ('id', 'organization', 'position', 'first_name', 'last_name', 'date_of_birth', 'email', 'address', 'gender', 'avatar', 'phone', 'role')
