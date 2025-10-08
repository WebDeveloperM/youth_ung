from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from core.utils.serializers import BaseSerializer
from users.models import User
from users.utils.phone_validator import PHONE_VALIDATOR


class CheckInSerializer(BaseSerializer):
    phone = serializers.CharField(validators=[PHONE_VALIDATOR])
    code = serializers.CharField()

    def validate(self, attrs):
        phone = attrs.get("phone")
        code = attrs.get("code")

        if phone == '+998999999999' and code == '999999':
            # TODO: After testing by Apple. Remove this logic!
            fake_user = User.objects.filter(phone=phone).first()
            fake_user.is_active = True
            fake_user.confirmation_code = None
            fake_user.save()
            attrs['user'] = fake_user
            return attrs

        user = User.objects.prefetch_related('chats').filter(phone=phone).first()

        if not user:
            msg = 'Такой пользователь не существует!'
            raise AuthenticationFailed(msg, code='authorization')

        if user and not user.confirmation_code:
            msg = 'Попробуйте заново зайти!'
            raise AuthenticationFailed(msg, code='authorization')

        if not user or not user.chats.all() or user.confirmation_code.split(':')[1] != code:
            msg = 'Указан неправильный `phone` или `code`!'
            raise AuthenticationFailed(msg, code='authorization')

        user.is_active = True
        user.confirmation_code = None
        user.save()

        attrs['user'] = user
        return attrs
