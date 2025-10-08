from django.conf import settings

from core.utils.url_safe_base64 import base64_encode


def make_sign_up_link(user):
    code = base64_encode(f'{user.confirmation_code.split(":")[0]}:{user.id}')
    bot_link = f'https://t.me/{settings.BOT_NAME}?start={code}'
    return bot_link
