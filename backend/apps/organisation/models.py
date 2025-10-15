from core.models import BaseModel
from django.db import models

from users.utils.phone_validator import PHONE_VALIDATOR


class Organisation(BaseModel):
    name = models.CharField(unique=True, max_length=200)
    email = models.EmailField(unique=True)
    address = models.CharField(unique=False, max_length=100)
    avatar = models.ImageField(upload_to='organisation/images', null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, validators=[PHONE_VALIDATOR], null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'organisation'


class Department(BaseModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(unique=True, max_length=300)

    def __str__(self):
        return f"{self.name} ({self.organisation})"

    class Meta:
        db_table = 'department'


class Section(BaseModel):
    departament = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(unique=True, max_length=200)

    def __str__(self):
        return f"{self.departament.name} / {self.name}"

    class Meta:
        db_table = 'section'

