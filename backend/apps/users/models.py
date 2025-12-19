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
    COORDINATOR = 'Coordinator'

    ROLE = (
        (ADMIN, 'Администратор'),
        (MODERATOR, 'Модератор'),
        (COORDINATOR, 'Координатор'),
        (USER, 'Пользователь'),
    )

    username = models.CharField(max_length=150, unique=False)
    organization = models.ForeignKey(Organisation, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    first_name = models.CharField(unique=False, max_length=50)
    last_name = models.CharField(unique=False, max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(unique=True, blank=True)
    address = models.CharField(unique=False, max_length=100)
    gender = models.CharField(unique=False, max_length=100)
    avatar = models.ImageField(upload_to='users/images', null=True, blank=True)
    phone = models.CharField(max_length=15, validators=[PHONE_VALIDATOR])
    role = models.CharField(max_length=255, choices=ROLE, default=USER)
    allowed_menus = models.JSONField(default=list, blank=True, help_text="Список разрешенных меню для администратора")
    
    # Образование
    education_level = models.CharField(max_length=50, null=True, blank=True, choices=[
        ('secondary', 'Среднее образование'),
        ('higher', 'Высшее образование'),
    ])
    is_foreign_graduate = models.BooleanField(default=False, verbose_name="Выпускник зарубежного вуза")
    is_top300_graduate = models.BooleanField(default=False, verbose_name="Выпускник TOP 300")
    is_top500_graduate = models.BooleanField(default=False, verbose_name="Выпускник TOP 500")
    
    # Тип сотрудника
    staff_type = models.CharField(max_length=50, null=True, blank=True, choices=[
        ('technical', 'Технический сотрудник'),
        ('service', 'Обслуживающий персонал'),
    ])
    is_promoted = models.BooleanField(default=False, verbose_name="Повышен в должности")
    
    # Языковые сертификаты
    has_ielts = models.BooleanField(default=False, verbose_name="Имеет IELTS")
    has_cefr = models.BooleanField(default=False, verbose_name="Имеет CEFR")
    has_topik = models.BooleanField(default=False, verbose_name="Имеет TOPIK")
    
    # Научные степени
    scientific_degree = models.CharField(max_length=50, null=True, blank=True, choices=[
        ('phd', 'PhD'),
        ('dsc', 'DSc'),
        ('candidate', 'Соискатель'),
    ])
    
    # Лидерские позиции
    leadership_position = models.CharField(max_length=50, null=True, blank=True, choices=[
        ('director', 'Директор'),
        ('head', 'Начальник'),
        ('manager', 'Менеджер'),
    ])
    
    # Государственные награды
    state_award_type = models.CharField(max_length=50, null=True, blank=True, choices=[
        ('order', 'Орден'),
        ('medal', 'Медаль'),
        ('honorary', 'Почетное звание'),
    ])

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
