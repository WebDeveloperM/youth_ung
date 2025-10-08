import uuid

from django.conf import settings
from rest_framework import serializers

from academy.models import Student, Teacher
from users.models import User
from bot.main import main_bot
from core.utils.random_numbers import random_numbers
from users.utils.make_sign_up_link import make_sign_up_link
from users.utils.phone_validator import PHONE_VALIDATOR


class SignInSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[PHONE_VALIDATOR])
    role = serializers.ChoiceField(choices=[('Student', 'student'), ('Teacher', 'teacher'), ('Admin', 'admin')],
                                   required=False)
    message = serializers.CharField(required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        phone = data.get('phone')
        role = data.get('role')

        rand_num = random_numbers(6)
        key = f'{str(uuid.uuid4()).split("-")[-1]}:{rand_num}'

        has_user = User.objects.prefetch_related('chats').filter(phone=phone).first()
        teacher_user = Teacher.objects.filter(user=has_user).first()

        if has_user and has_user.chats.all():
            chats = has_user.chats.all()
            has_user.confirmation_code = key
            has_user.save()

            try:
                for chat in chats:
                    main_bot.send_message(chat.chat_id, f'*Ваш проверочный код:*  `{rand_num}`', 'Markdown')
            except chats.DoesNotExist:
                # Handle Error and send with Sentry
                pass
            data['message'] = f'https://t.me/{settings.BOT_NAME}'

        if not has_user:
            has_user, _ = User.objects.update_or_create(
                phone=phone,
                defaults={
                    'type': role and role or User.STUDENT,
                    'confirmation_code': key
                }
            )

        if not hasattr(has_user, 'student') and (not role or role == User.STUDENT):
            Student.objects.create(user=has_user)

        if not teacher_user and role == User.TEACHER:
            Teacher.objects.create(user=has_user)

        data['message'] = make_sign_up_link(has_user)
        return data

    class Meta:
        model = User
        fields = ('phone', 'message')
