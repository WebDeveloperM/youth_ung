from django.contrib.auth.models import AbstractUser

from core.models import BaseModel
from django.db import models
from django.db.models import QuerySet, CASCADE

from users.querysets.user import UsersManager
from users.utils import tokens
from users.utils.phone_validator import PHONE_VALIDATOR
from users.utils.fields import expires_default, expires_hour

from organisation.models import Organisation


class User(AbstractUser):
    MODERATOR = 'Moderator'
    USER = 'User'
    ADMIN = 'Admin'

    ROLE = (
        (MODERATOR, 'Модератор'),
        (USER, 'Пользователь'),
        (ADMIN, 'Администратор'),
    )

    username = models.CharField(unique=False)
    organization=models.ForeignKey(Organisation, on_delete=models.CASCADE, null=True, blank=True)
    position=models.CharField(max_length=100)
    first_name = models.CharField(unique=False, max_length=50)
    last_name = models.CharField(unique=False, max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(unique=True, blank=True)
    address = models.CharField(unique=False, max_length=100)
    gender = models.CharField(unique=False, max_length=100)
    avatar = models.ImageField(upload_to='users/images', null=True, blank=True)
    phone = models.CharField(max_length=15, validators=[PHONE_VALIDATOR])
    role = models.CharField(max_length=255, choices=ROLE, default=USER)
    password = models.CharField(unique=False, max_length=100)
    confirm_password = models.CharField(unique=False, max_length=100)

    objects = UsersManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta(AbstractUser.Meta):
        db_table = 'users_user'
        app_label = 'users'

class Token(BaseModel):
    key = models.CharField(max_length=40, unique=True)
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, models.CASCADE, related_name='tokens')
    expires_at = models.DateTimeField(default=expires_default)  # token expires in 30 days

    objects = QuerySet.as_manager()

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = tokens.generate()
        return super(Token, self).save(*args, **kwargs)

    def __str__(self):
        return self.key

    class Meta:
        db_table = 'users_token'


class ResetPassword(BaseModel):
    key = models.CharField(max_length=40, unique=True)
    user = models.ForeignKey(User, models.CASCADE)
    expires_at = models.DateTimeField(default=expires_hour)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = tokens.generate()
        return super(ResetPassword, self).save(*args, **kwargs)

    def __str__(self):
        return self.key

    class Meta:
        db_table = 'users_reset_password'
