from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from users.utils.phone_validator import PHONE_VALIDATOR

User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(input_formats=['%d-%m-%Y'], required=False)

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
            'role'
        )
        extra_kwargs = {
            'email': {'validators': []},
        }

    def validate(self, data):
        if User.objects.filter(email=data['email']).exists():
            raise ValidationError({'email': 'Bu email bilan foydalanuvchi mavjud.'})
        # if User.objects.filter(phone=data['phone']).exists():
        #     raise ValidationError({'phone': 'Bu telefon raqam allaqachon ro‘yxatdan o‘tgan.'})
        return data

    def save(self, **kwargs):
        validated_data = self.validated_data

        print(validated_data)
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
            raise ValidationError({'error': f"Foydalanuvchi yaratishda xatolik: {str(e)}"})
