from django.contrib.auth.models import AbstractUser

from core.models import BaseModel
from django.db import models
from django.db.models import QuerySet, CASCADE

from users.querysets.user import UsersManager
from users.utils import tokens
from users.utils.phone_validator import PHONE_VALIDATOR
from users.utils.fields import expires_default, expires_hour


class User(AbstractUser):
    TEACHER = 'Teacher'
    STUDENT = 'Student'
    ADMIN = 'Admin'

    ROLE = (
        (TEACHER, 'Учитель'),
        (STUDENT, 'Студент'),
        (ADMIN, 'Администратор'),
    )

    username = models.CharField(unique=False)
    avatar = models.ImageField(upload_to='users/images', null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, validators=[PHONE_VALIDATOR])
    confirmation_code = models.CharField(max_length=255, null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    type = models.CharField(max_length=255, choices=ROLE, default=STUDENT)
    # channel = models.OneToOneField('academy.MarketingChannel', CASCADE, null=True, blank=True, related_name='users')

    objects = UsersManager()

    USERNAME_FIELD = 'phone'
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
