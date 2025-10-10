from typing import Union

from django.core.exceptions import ObjectDoesNotExist

from users.models import User


def get_user(**kwargs) -> Union[User, None]:
    try:
        return User.objects.get(**kwargs)
    except ObjectDoesNotExist:
        return None
