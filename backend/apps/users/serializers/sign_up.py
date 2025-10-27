from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from users.utils.phone_validator import PHONE_VALIDATOR

User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(input_formats=['%d-%m-%Y'], required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    email= serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = (
            'organization',
            'position',
            'first_name',
            'last_name',
            'date_of_birth',
            'email',
            'address',
            'gender',
            'phone',
            'role',
            'password',
            'confirm_password',
        )
        extra_kwargs = {
            'email': {'validators': []},
        }

    def validate(self, data):
        if User.objects.filter(email=data['email']).exists():
            raise ValidationError({'email': 'Bu email bilan foydalanuvchi mavjud.'})

        if data['password'] != data['confirm_password']:
            raise ValidationError({'password': 'Parollar mos emas.'})


        return data

    def save(self, **kwargs):
        validated_data = self.validated_data

        # print(validated_data, "11111111111111111111111111111")
        try:
            user = User.objects.create(
                organization=validated_data['organization'],
                position=validated_data['position'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                date_of_birth=validated_data['date_of_birth'],
                email=validated_data['email'],
                address=validated_data['address'],
                gender=validated_data['gender'],
                phone=validated_data['phone'],
                role=validated_data['role'],
            )

            password = validated_data.get('password')
            if password:
                user.set_password(password)
                user.save()

            return user

        except Exception as e:
            print(e, "message11111111111")
            raise ValidationError({'error': f"Foydalanuvchi yaratishda xatolik: {str(e)}"})

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)

        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user